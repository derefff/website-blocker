'use strict'
//let bg = chrome.extension.getBackgroundPage()
var url;
let blocked_sites = []

function block_site(site) { return new RegExp(`^(.*)?${site}(.*)?`) }

function current_site()
{
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, 
		tabs=>{
			if(tabs[0])
			{
				url =	tabs[0].url
				for(const b_site of blocked_sites)
					if(b_site.test(url))
						chrome.tabs.update( chrome.tabs.getCurrent(t=>{if(t) return t.id}),
							{url: "chrome://newtab"})
			}
		})
}

chrome.tabs.onUpdated.addListener(current_site)
chrome.storage.onChanged.addListener(changes=>{
	if(changes['sites-list'])	
	{
		blocked_sites = []
		for(const s of changes['sites-list'].newValue)
			blocked_sites.push(block_site(s))
	}
})
