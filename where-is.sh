function where-is() {
  local SPLIT='process.env.PATH.split(":")';
  local MAP='map(path => `ls ${path}/'$1'`)';
  local LOG='forEach(ls => console.log(ls))';
  node -e "${SPLIT}.${MAP}.${LOG}" | bash 2>/dev/null
}
