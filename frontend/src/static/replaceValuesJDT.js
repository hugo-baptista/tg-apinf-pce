import objPath from "object-path";
const replaceValuesJDT = (jdt, composition) => {
 //fazer cópida do jdt
 let newJDT = { ...jdt };
 //expressão regular para remover tudo o que esteja na composition para além do itemPath
 const regex = /((?!value|start|end|date|time|unit).)*/g;
 //ir buscar todos os itemPaths da composition usando a expressão regular
 const compositionKeys = Object.keys(composition).map(key=>
key.match(regex)[0].slice(0, -1));
 //percorre cada itemPath da composition
 for (let index in compositionKeys) {
 let itemPath = compositionKeys[index];
 //vai procurar no jdt o itemPath que está na composition
 let obj = objPath.get(newJDT, itemPath);
 // se encontrar (ou seja se o objeto for diferente de undefined), faz a substituição pelo valor da composition
 if (obj !== undefined) {
 switch(obj.dataType) {
 case "DV_DATE_TIME":
 obj.value.date =
composition[itemPath.concat('.value.date')];
 obj.value.time =
composition[itemPath.concat('.value.time')];
 break;
 case "DV_DURATION":
 case "DV_QUANTITY":
 obj.value.value =
composition[itemPath.concat('.value.value')];
 obj.value.unit =
composition[itemPath.concat('.value.unit')];
 break;
 case "DV_INTERVAL<DV_DATE>":
 case "DV_INTERVAL<DV_COUNT>":
 case "DV_INTERVAL<DV_TIME>":
 obj.value.start =
composition[itemPath.concat('.value.start')];
 obj.value.end =
composition[itemPath.concat('.value.end')];
 break;
 case "DV_INTERVAL<DV_DATE_TIME>":
 obj.value.date.start =
composition[itemPath.concat('.value.date.start')];
 obj.value.date.end =
 composition[itemPath.concat('.value.date.end')];
 obj.value.time.start =
composition[itemPath.concat('.value.time.start')];
 obj.value.time.end =
composition[itemPath.concat('.value.time.end')];
 break;
 case "DV_INTERVAL<DV_QUANTITY>":
 obj.value.value.start =
composition[itemPath.concat('.value.value.start')];
 obj.value.value.end =
composition[itemPath.concat('.value.value.end')];
 obj.value.unit =
composition[itemPath.concat('.value.unit')];
 break;
 default:
 obj.value = composition[itemPath.concat('.value')]
 }
 }
 }
 return newJDT;
}
export { replaceValuesJDT };