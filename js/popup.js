'use strict'
const update_btn = document.querySelector("#update")
const block_domain_btn = document.querySelector("#block-domain")
const block_page_btn= document.querySelector("#block-page")
const checkbox_btn = document.querySelector("#hide-blocked-sites")
const dark_mode_btn= document.querySelector("#dark-mode-toggle")
const textarea = document.querySelector("#list-sites")
const domain_template = new RegExp('(^https?://)(.*\.(com|org|net))(/.*)$')
//works for sites like .de .pl but no for .com .org
//const domain_template = new RegExp('(^https?://)(.*\.(com|org|net|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|br|bq|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cw|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zr|zw))(/?.*)')
const page_template = new RegExp('(^https?://)(.*)')

chrome.storage.local.get(['checkbox:hide'], result=>{
	checkbox_btn.checked = result['checkbox:hide']
	toggle_block_sites_area()
})

chrome.storage.local.get(['checkbox:dark-mode'], result=>{
	dark_mode_btn.checked = result['checkbox:dark-mode']
	toggle_dark_mode()
})
chrome.storage.local.get(['sites-list'], result=>{
		if(result) textarea.value = result['sites-list'] 
})

let sites = []

update_btn.addEventListener('click', ()=>{
	const textarea_value = textarea.value.split('/n')	//spliting value to lines

	for(const i of textarea_value) sites.push(i)

	chrome.storage.local.set({'sites-list': sites}, ()=>{console.log('setting sites')})	
	document.querySelector("#updated").style.opacity = 1
})

checkbox_btn.addEventListener('click', ()=>{
	if(checkbox_btn.checked)
		chrome.storage.local.set({'checkbox:hide': true}, ()=>{console.log(true)})
	else
		chrome.storage.local.set({'checkbox:hide': false}, ()=>{console.log(false)})

	toggle_block_sites_area()
})

dark_mode_btn.addEventListener('click', ()=>{
	if(dark_mode_btn.checked)
		chrome.storage.local.set({'checkbox:dark-mode': true}, ()=>{console.log("dark mode on")})
	else
		chrome.storage.local.set({'checkbox:dark-mode': false}, ()=>{console.log("dark mode off")})
	toggle_dark_mode()
})

block_page_btn.addEventListener('click', ()=>{
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, 
	tabs=>{
		if(tabs[0]) textarea.value += (textarea.value)? "\n"+tabs[0].url.replace(page_template,"$2") : tabs[0].url.replace(page_template, "$2")
	})
})

block_domain_btn.addEventListener('click', ()=>{
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, 
	tabs=>{
		if(tabs[0]) 
		{
			textarea.value += (textarea.value)? "\n"+tabs[0].url.replace(domain_template, '$2') : tabs[0].url.replace(domain_template, '$2')
		}
	})
})
function toggle_block_sites_area() { document.querySelector('#block-sites-container').style.display = (checkbox_btn.checked)? "none" : "block" }
function toggle_dark_mode() { document.querySelector('body').className = (dark_mode_btn.checked)? "dark-mode" : "day-mode" }
