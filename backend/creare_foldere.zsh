#!/bin/zsh

# Setează calea de bază pentru folderul imagini
BASE_PATH="./backend/imagini"

# Lista produselor
PRODUSE=(
  "Samsung_Galaxy_S23_Ultra"
  "iPhone_14_Pro_Max"
  "Google_Pixel_7_Pro"
  "OnePlus_11_5G"
  "Xiaomi_13_Pro"
  "Samsung_Galaxy_Z_Fold_4"
  "iPhone_13_Mini"
  "ASUS_ROG_Phone_6"
  "Motorola_Edge_40_Pro"
  "Realme_GT_2_Pro"
  "iPad_Pro_12_9_2023"
  "Samsung_Galaxy_Tab_S8_Ultra"
  "Microsoft_Surface_Pro_9"
  "Lenovo_Tab_P12_Pro"
  "Huawei_MatePad_Pro_12_6"
  "Amazon_Fire_HD_10_Plus"
  "Xiaomi_Pad_6_Pro"
  "iPad_Air_5"
  "Samsung_Galaxy_Tab_A8"
  "Lenovo_Yoga_Tab_13"
)

# Creează folderele pentru fiecare produs
for produs in $PRODUSE; do
  FOLDER_PATH="${BASE_PATH}/${produs}"
  mkdir -p "$FOLDER_PATH"
  echo "Folder creat: $FOLDER_PATH"
done

echo "Toate folderele au fost create!"