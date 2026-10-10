const input=document.getElementById("file"),drop=document.getElementById("drop"),scan=document.getElementById("scan");
let selected=null,url=null;
const error=document.getElementById("error"),result=document.getElementById("result");
function showError(msg){error.textContent=msg;error.hidden=!msg}
function choose(file){showError("");result.hidden=true;if(!file)return;
if(!file.type.startsWith("image/")){selected=null;scan.disabled=true;showError("Please choose an image file.");return}
if(file.size>10*1024*1024){selected=null;scan.disabled=true;showError("Image must be 10 MB or smaller.");return}
selected=file;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);
document.getElementById("preview").src=url;document.getElementById("filename").textContent=file.name;
document.getElementById("empty").hidden=true;document.getElementById("previewBox").hidden=false;
scan.disabled=false;document.getElementById("hint").textContent="Image ready. Click Scan image to get the prediction."}
input.addEventListener("change",()=>choose(input.files[0]));
["dragenter","dragover"].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add("over")}));
["dragleave","drop"].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove("over")}));
drop.addEventListener("drop",e=>choose(e.dataTransfer.files[0]));
scan.addEventListener("click",async()=>{if(!selected)return;showError("");scan.disabled=true;scan.textContent="Scanning...";
const body=new FormData();body.append("file",selected);
try{const response=await fetch("/api/scan",{method:"POST",body});const data=await response.json();if(!response.ok)throw Error(data.detail||"Scan failed.");
document.getElementById("predicted").textContent=data.predicted_class;
document.getElementById("confidence").textContent=data.confidence.toFixed(2)+"%";
document.getElementById("bar").style.width=Math.min(100,Math.max(0,data.confidence))+"%";
document.getElementById("category").textContent=data.category;result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"nearest"});
}catch(e){showError(e.message||"Could not scan image.")}finally{scan.disabled=!selected;scan.textContent="Scan image ↗"}});
document.getElementById("again").addEventListener("click",()=>{input.value="";selected=null;result.hidden=true;
document.getElementById("previewBox").hidden=true;document.getElementById("empty").hidden=false;scan.disabled=true;showError("");
document.getElementById("hint").textContent="Choose a clear image of one waste item.";if(url)URL.revokeObjectURL(url);url=null;window.scrollTo({top:0,behavior:"smooth"})});
