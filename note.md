mongodump --uri="mongodb://127.0.0.1/fermi-it" --out="./dump"

mongorestore \
  --uri="mongodb+srv://david2k6matias_db_user:fqcKQHEPT8NSJW6y@cluster0.yefq8th.mongodb.net/fermi-it" \
  --nsInclude="fermi-it.*" \
  ./dump/fermi-it
