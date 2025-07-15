#!/bin/bash

count=1
while read -r alg; do
    # URL-encode the algorithm (replace spaces with '+')
    encoded_alg=$(echo "$alg" | sed 's/ /+/g')
    
    # Construct the URL
    # url="https://cube.rider.biz/visualcube.php?fmt=png&size=200&view=plan&stage=oll&alg=$encoded_alg&r=y29x-26&bg=t"
    # url="https://cube.rider.biz/visualcube.php?fmt=png&size=200&view=plan&stage=pll&alg=$encoded_alg&r=y29x-26&bg=t"
    url="https://cube.rider.biz/visualcube.php?fmt=png&size=200&view=oblique&stage=f2l&alg=$encoded_alg&r=y29x-26&bg=t"
    # Download and save with incremental filename
    # curl -s -o "oll_case_$count.png" "$url"
    # curl -s -o "pll_case_$count.png" "$url"
    curl -s -o "f2l_case_$count.png" "$url"
    
    # Increment counter
    ((count++))
done < f2l_algorithms.txt
# done < pll_algorithms.txt
# done < oll_algorithms.txt
