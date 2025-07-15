# How to download cube images

From the case constant files extract the algorithms to txt using below commands:
```bash
awk -F'"' '/setupMoves:/ {print $2}' f2lcases.ts > f2l_algorithms.txt
awk -F'"' '/setupMoves:/ {print $2}' pllcases.ts > pll_algorithms.txt
```

Download the images using the `download_cubeimg.sh` script:
```bash
./download_cubeimg.sh
```

>Just update the shell script to download the images from the correct URLs and save them to the correct filenames.

Bulk rename svg to png if needed:
```bash
find . -name "*.svg" -exec sh -c 'mv "$0" "${0%.svg}.png"' {} \;
```