for file in Admin*P1.org
do 
    mv -i "${file}" "${file/P1/P2}"
done
