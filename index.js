import {IfcAPI} from "web-ifc/web-ifc-api"

//Crea instancia de la API de IFC.js
const ifcapi=new IfcAPI()

//Crea referencias de los objetos gráficos de la app
const button = document.getElementById("file-opener-button");
const leftContainer = document.getElementById("left-container");
const saveButton = document.getElementById("save-button");
const json = document.getElementById("json");
const input = document.getElementById("file-input");

//Cargado de archivos del fichero
button.addEventListener('click', () => input.click())
input.addEventListener(
    "change",
    (changed) =>{
        const reader= new FileReader();
        reader.onload= () => LoadFile(reader.result)
        reader.readAsText(changed.target.files[0])
    },
    false
)

//Carga el ifc en la API
function LoadFile(ifcAsText){
    leftContainer.innerHTML = ifcAsText.replace(/(?:\r\n|\r|\n)/g, '<br>');
    const modelID=OpenIfc(ifcAsText)
    const allItems=GetAllItems(modelID)
    const result=JSON.stringify(allItems,undefined,2)
    json.textContent=result
    const blob=new Blob([result],{type:'aplication/json'})
    saveButton.href=URL.createObjectURL(blob)
    saveButton.download='data.json'
    saveButton.click()
    ifcapi.CloseModel(modelID)
}

function OpenIfc(ifcAsText){
    ifcapi.Init()
    return ifcapi.OpenModel(ifcAsText)

}
function GetAllItems(modelID,excludeGeometry=true){
    const allItems={}
    const lines= ifcapi.GetAllLines(modelID)    
    GetAllItemsFromLines(modelID,lines,allItems,excludeGeometry)
    return allItems
}

function GetAllItemsFromLines(modelID,lines,allItems,excludeGeometry){
    for( let i=1; i<= lines.size(); i++) {
        try{
            saveProperties(modelID,lines,allItems,excludeGeometry,i)

        } catch (e){
            console.log(e)
        }
    }
}

function saveProperties(modelID,lines,allItems,excludeGeometry,index){
    const itemID=lines.get(index)
    const props=ifcapi.GetLine(modelID,itemID)
    props.type=props.__proto__.constructor.name
    if (!excludeGeometry || !geometryTypes.has(props.type)){
        allItems[itemID]=props
    }
}