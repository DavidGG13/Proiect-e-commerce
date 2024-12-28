import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { PageSchema, Action } from '../schema';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  Stack,
} from '@chakra-ui/react';
import { GenericForm } from './GenericForm';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { MaterialReactTable } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import { io } from 'socket.io-client';
import { newSocket } from '../utils/websockets';

export function pageToUrl(page: PageSchema): string {
  return `${page.name.toLowerCase().replace(' ', '_')}`;
}

function Header({ pages, data, basePath }: { pages: PageSchema[]; data: any[]; basePath: string }) {
  return (
    <Box background="blue.50" padding={1}>
      <Stack margin={3} direction="row" justifyContent="space-between" alignItems="center">
        <Stack margin={4} gap={10} direction="row" alignItems="center" wrap="wrap">
          {pages.map((p, index) => (
            <Box as="a" href={`${basePath}/${pageToUrl(p)}`} key={index}>
              {p.name}
            </Box>
          ))}
        </Stack>
        <Stack direction="row">
          <Button
            colorScheme="red"
            onClick={() => {
              const filename = prompt('Enter filename:');
              if (filename) exportToCSV(data, filename);
            }}
          >
            Export Data
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function exportToCSV(data: any[], filename: string) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    showColumnHeaders: false,
    filename: filename,
  });

  if (data.length > 1) {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  } else {
    Swal.fire({
      title: 'Error while exporting CSV!',
      text: 'There is no data to export.',
    });
  }
}

export function AdminPage({
  pages,
  selectedPage,
  basePath,
  apiURL = '',
}: {
  pages: PageSchema[];
  selectedPage: PageSchema;
  basePath: string;
  apiURL?: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAction, setSelectedAction] = useState({} as Action);
  const [data, setData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[][]>([]);
  const [rowId, setRowId] = useState<number>();
  const [rowObject, setRowObject] = useState<any>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [socket, setSocket] = useState(io);
  newSocket(setSocket, apiURL);

  useEffect(() => {
    selectedPage.getRequest().then((resArray) => {
      setData(resArray);
      setRefetch(false);
    });
  }, [refetch]); // Do not remove 'refetch' from here !!!

  useEffect(() => {
    socket.on('updateData', (message) => {
      console.log('Message emitted from socket: ' + message);
      setRefetch(true);
      const rowActionsMenu = document.querySelector(
        '.MuiPaper-root.MuiPopover-paper.MuiMenu-paper',
      );
      if (rowActionsMenu) {
        rowActionsMenu.remove();
      }
    });
  }, [socket, selectedPage]);

  useEffect(() => {
    setDisplayData(
      data.map((table_data) => selectedPage.tableFields.map((field) => field.access(table_data))),
    );
  }, [data]);

  return (
    <>
      <Header
        pages={pages}
        data={[selectedPage.tableFields.map((field) => field.name), ...displayData]}
        basePath={basePath}
      />

      <ThemeProvider theme={createTheme()}>
        <MaterialReactTable
          columns={selectedPage.tableFields.map((field, index) => ({
            accessorFn: (row: any) => {
              if (typeof row[index] === 'boolean') {
                row[index] = String(row[index]);
              }
              return row[index];
            },
            header: field.name,
          }))}
          data={displayData}
          muiTableContainerProps={{ sx: { maxHeight: '70vh' } }}
          enableColumnResizing
          enableColumnPinning
          enableGlobalFilterModes
          enablePagination={false}
          paginationDisplayMode="pages"
          enableRowVirtualization
          rowVirtualizerOptions={{ overscan: 20 }}
          renderTopToolbarCustomActions={() => (
            <ChakraProvider>
              <Stack margin={0} padding={2} direction="row" wrap="wrap">
                {selectedPage.actions.map((action, index) => (
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      setSelectedAction(action);
                      onOpen();
                    }}
                    key={index}
                  >
                    {action.name}
                  </Button>
                ))}
              </Stack>
            </ChakraProvider>
          )}
          enableRowActions
          renderRowActionMenuItems={(obj) => {
            return selectedPage.rowActions.map((rowAction, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setSelectedAction(rowAction);
                  setRowId(obj.row.original[0]);
                  if (obj.staticRowIndex !== undefined) {
                    setRowObject(data[obj.staticRowIndex]);
                  }
                  onOpen();

                  const rowActionsMenu = document.querySelector(
                    '.MuiPaper-root.MuiPopover-paper.MuiMenu-paper',
                  );
                  if (rowActionsMenu) {
                    rowActionsMenu.remove();
                  }
                }}
              >
                {rowAction.name}
              </MenuItem>
            ));
          }}
        />
      </ThemeProvider>

      <Modal size={'6xl'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAction.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAction.fields ? (
              <GenericForm
                action={selectedAction}
                onClose={onClose}
                rowId={rowId}
                rowObject={rowObject}
              />
            ) : (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  if (rowObject !== undefined) {
                    selectedAction.onSubmit(rowId, rowObject);
                  } else {
                    selectedAction.onSubmit(rowId);
                  }
                  onClose();
                }}
              >
                Confirm Action
              </Button>
            )}
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
