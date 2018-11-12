#!/bin/bash
#Remove PodFiles and Build Folder From iOS Folder
echo "Ensure this script is placed inside the iOS folder of your React-Native project"
echo "Running this Script will Remove Pods and Build Folder Do you want to continue?"
while true; do
    read -p "Do you wish to install this program?" yn
    case $yn in
        [Yy]* ) deleteFiles; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

deleteFiles()
{
  $rm -rf Pods
  $rm -rf build
}
