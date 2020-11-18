a=$(cat idsmla)
for i in $a; do node mla.js "$i" "$1" &> "logs/$i" || echo "$i" >> mlafails.txt ; sleep 5; done
