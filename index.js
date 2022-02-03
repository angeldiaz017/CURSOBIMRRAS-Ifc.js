import {IfcAPI} from "web-ifc/web-ifc-api"

const ifcApi=new IfcAPI ()
ifcApi.Init()

console.log('hola')
const button = document.getElementById('input-button')
const input=document.getElementById('input-element')

button.onclick= () => {
    input.click()
}

input.onchange=(changed)=>{
    console.log(changed)
    const reader= new FileReader()
    reader.onload= () => loadIfc(reader.result)
    reader.readAsText(changed.target.files[0])
}

function loadIfc(IfcData) {
    console.log(IfcData)
    const modelID = ifcApi.OpenModel(IfcData)
    const allItems=ifcApi.GetAllLines(modelID)

}
