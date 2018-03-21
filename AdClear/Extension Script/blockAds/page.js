String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
};

//judge the node whether containg text node
var isIncludeTextRes=false;
var variousFlag=false;
function isIncludeTextNode(node){
	var nodeChildLen=0;
	if(node){
		nodeChildLen=node.childNodes.length;
	}
	if(nodeChildLen==0){
		if(node.nodeType==3){
			if(node.nodeValue && node.nodeValue.replace(/(^\s*)|(\s*$)/g, "").length>2){
				isIncludeTextRes=true;
				return;
			}
		}else if(node.nodeType==1){
			if(node.nodeName=='EMBED'){
				variousFlag=true;
				return;
			}else if(node.nodeName=='IFRAME'){
				variousFlag=true;
				return;
			}
		}
	}else{
		if(node && node.nodeName=='STYLE'){
			return;
		}else if(node && node.nodeName=='SCRIPT'){
			return;
		}
		for(var i=0;i<nodeChildLen;i++){
			var childTmp=node.childNodes[i];
			if(variousFlag){
				return;
			}
			if(isIncludeTextRes){
				return;
			}else{
				isIncludeTextNode(childTmp);
			}
		}
	}
}

//find the nearest div element in the parameter 'node'
var mostVicinityDivNodeRes="";
function findMostVicinityDivNode(node){
	if(node && node.parentElement){
		if(node.parentElement.nodeType==1){
			if(node.parentElement.nodeName=='DIV' || node.parentElement.nodeName=='BODY' || node.parentElement.nodeName=='INS' || node.parentElement.nodeName=='LI'
			|| node.parentElement.nodeName=='ASIDE' || node.parentElement.nodeName=='SECTION'){
				mostVicinityDivNodeRes=node.parentElement;
				return;
			}else{
				var tmpNode=node.parentElement;
				findMostVicinityDivNode(tmpNode);
			}
		}
	}
}

// judge the div element whether containing the picture, iframe or a 
var result=false;
function isIncludePic(divEle,type){
	var divEleChildrenLen=divEle.childNodes.length;
	if(divEleChildrenLen>=10){
		result=true;
		return;
	}
	if(type=='text'){
		if(divEleChildrenLen==0){
			if(divEle.nodeType==1){
				if(divEle.nodeName=='IMG'){
					result=true;
					return;
				}else if(divEle.nodeName=='IFRAME'){
					result=true;
					return;
				}else if(divEle.nodeName=='EMBED'){
					result=true;
					return;
				}
			}else if(divEle.nodeType==3){
				if(divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}
			}
		}else{
			if(divEle.nodeName=='IFRAME'){
				result=true;
				return;
			}else if(divEle.nodeName=='OBJECT'){
				result=true;
				return;
			}else if(divEle.nodeName=='EMBED'){
				result=true;
				return;
			}else if(divEle.nodeName=='LI'){
				result=true;
				return;
			}
			for(var z=0;z<divEleChildrenLen;z++){
				var childTextTmp=divEle.childNodes[z];
				if(result){
					break;
				}
				isIncludePic(childTextTmp,type);
			}
		}
	}else{
		if(divEleChildrenLen==0){
			if(divEle.nodeType==3){
				if(divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}
			}
			if(divEle.nodeType==1){
				if(divEle.nodeName=='A'){
					var objDivEle=window.getComputedStyle(divEle);
					var objDivEleWidth=parseInt(objDivEle.width.replace(/[^0-9]/ig,"")),
						objDivEleHeight=parseInt(objDivEle.height.replace(/[^0-9]/ig,""));
					if(objDivEle.display=='block' && objDivEleWidth>=20 && objDivEleHeight>=20){
						result=true;
						return;
					}
				}else if(divEle.nodeName=='IMG' && divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}else if(divEle.nodeName=='IMG'){
					var previousEleNode=divEle.previousElementSibling,
						nextEleNode=divEle.nextElementSibling;
					if((previousEleNode&&previousEleNode.nodeName=='A'&&nextEleNode&&nextEleNode.nodeName=='IMG')||
						(previousEleNode&&previousEleNode.nodeName=='IMG'&&nextEleNode&&nextEleNode.nodeName=='A')){
						result=true;
						return;
					}
				}else if(divEle.nodeName=='IFRAME'){
					result=true;
					return;
				}else if(divEle.nodeName=='EMBED'){
					result=true;
					return;
				}else{
					var objBackgroundTmp=window.getComputedStyle(divEle);
					if(objBackgroundTmp.backgroundImage && objBackgroundTmp.backgroundImage!='none'){
						result=true;
						return;
					}
				}
			}
		}else{
		    if(divEle.nodeName=='IFRAME'){
				result=true;
				return;
			}else if(divEle.nodeName=='EMBED'){
				result=true;
				return;
			}else if(divEle.nodeName=='OBJECT'){
				result=true;
				return;
			}else if(divEle.nodeName=='LI'){
				result=true;
				return;
			}else{
				var obj=window.getComputedStyle(divEle);
				var divEleWidth=parseInt(obj.width.replace(/[^0-9]/ig,"")),
					divEleHeight=parseInt(obj.height.replace(/[^0-9]/ig,""));
				if(obj.backgroundImage && obj.backgroundImage!='none' && obj.position=="static" && divEleWidth>=50 && divEleHeight>=50){
					result=true;
					return;
				}
			}
			for(var i=0;i<divEleChildrenLen;i++){
				var childTmpOfDivEle=divEle.childNodes[i];
				if(childTmpOfDivEle.nodeName=='UL'){
					result=true;
					return;
				}
				if(result){
					break;
				}
				isIncludePic(childTmpOfDivEle,type);
			}
		}
	}
}


//record the attribute of node
function recordAttr(node){
	var currNodeAttr={};
	if(node.attributes){
		for(var i=0;i<node.attributes.length;i++){
			var tmpAttr=node.attributes[i];
			if(tmpAttr.nodeName!='class' && tmpAttr.nodeName!='id'){
				currNodeAttr[tmpAttr.nodeName]=tmpAttr.nodeValue;
			}
		}
	}
}

var aResult=false;
//judge whether the parent of parameter is a element
function isAElement(node){
	var parentNode=node.parentElement;
	if(parentNode.nodeName=="A"){
		aResult=true;
	}
}

var fixedWithLiResult=false;
//judge whether the node that position attribute with fixed is include li element
function isIncludeLiInFixedEle(node){
	var childLen=node.childNodes.length;
	if(childLen==0){

	}else{
		for(var i=0;i<childLen;i++){
			var childTmp=node.childNodes[i];
			if(childTmp.nodeType==1){
				if(childTmp.nodeName=="LI"){
					fixedWithLiResult=true;
					break;
				}
			}
			isIncludeLiInFixedEle(childTmp);
		}
	}
}


var realAdvertisementResult=true;
//judge whether the region is true ads region
function isTrueAdvertisement(node){
	var previousNode=node.previousElementSibling;
	var nextNode=node.nextElementSibling;
	var currNodeAttr=recordAttr(node);
	var currNodeAttrValue,prevNodeAttrValue,nextNodeAttrValue,prevNodeAttr,nextNodeAttr;
	if(previousNode && nextNode){
		prevNodeAttr=recordAttr(previousNode);
		nextNodeAttr=recordAttr(nextNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			prevNodeAttrValue=prevNodeAttr[key];
			nextNodeAttrValue=nextNodeAttr[key];
			if(parseInt(currNodeAttrValue)-1==parseInt(prevNodeAttrValue) && parseInt(currNodeAttrValue)+1==parseInt(nextNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}else if(previousNode){
		prevNodeAttr=recordAttr(previousNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			prevNodeAttrValue=prevNodeAttr[key];
			if(parseInt(currNodeAttrValue)-1==parseInt(prevNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}else if(nextNode){
		nextNodeAttr=recordAttr(nextNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			nextNodeAttrValue=nextNodeAttr[key];
			if(parseInt(currNodeAttrValue)+1==parseInt(nextNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}
}

var finalParentNode=null;
var divNum=0;

function findTheFirstDiv(node,type){
	finalParentNode=node.parentElement;
	if(!finalParentNode){
		return;
	}
	if(finalParentNode.nodeName!=='DIV' && finalParentNode.nodeName!='INS'&&finalParentNode.nodeName!='LI' && finalParentNode.nodeName!='UL'){
		findTheFirstDiv(finalParentNode,type);
	}else{
		isIncludePic(finalParentNode,type);
		if(result){
			result=false;
			return;
		}else{
			findTheFirstDiv(finalParentNode,type);
		}
	}
}

// the function that block node with ads
function shieldNode(node,type){
	findTheFirstDiv(node,type);
	if(finalParentNode){
		if(finalParentNode.id.indexOf("foot")!=-1 || finalParentNode.className.indexOf("foot")!=-1){
			var tmp=finalParentNode;
			return;
		}
		var shieldNodeParent=finalParentNode.parentElement;
		if(shieldNodeParent){
			if(finalParentNode.nodeName=='LI'){
				var len=finalParentNode.childNodes.length;
				for(var k=0;k<len;k++){
					var childOfLi=finalParentNode.childNodes[0];
					finalParentNode.removeChild(childOfLi);
				}

			}else{
				var divEle=document.createElement('div');
				shieldNodeParent.insertBefore(divEle,finalParentNode);
				var retChild=shieldNodeParent.removeChild(finalParentNode);
			}
		}else{
			finalParentNode.style.display='none';
		}
		finalParentNode=null;
	}
}

// deal with img element 
function dealImg(node,flag){
	if(node.src){
		if(node.src.indexOf("base64")==-1 && node.src.indexOf('about:blank')==-1){
			if(localStorage.hasOwnProperty(node.src)){
				var localRes=localStorage.getItem(node.src);
				if(localRes=='true'){
					if(flag){
						shieldNode(node,'img');
					}else{
						node.ownerDocument.body.style.display='none';
					}
				}
				return;
			}
			var xhr=new XMLHttpRequest();
			var url="http://127.0.0.1:3000/"+node.src;
			xhr.open("GET",url);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4 && xhr.status==200){

					if(xhr.responseText=="true"){
						localStorage.setItem(node.src,'true');
						if(flag){
							shieldNode(node,'img');
						}else{
							node.ownerDocument.body.style.display='none';
						}
					}else{
						localStorage.setItem(node.src,'false');
					}

				}
			};
			xhr.send();
		}
	}
}

function traverseDOM(node,flag){
	if(node&&node.nodeType==1&& node.id=='tanxssp_con_mm_15890324_2192376_23114697'){
		console.log(node);
	}
    var childLen=0;
	if(node){
		childLen=node.childNodes.length;
	}else{
		return;
	}
	if(childLen==0){
		if(node.nodeType==3){
			var re= /[\u4E00-\u9FA5]/g;
			var str="";
			if(node.nodeValue.match(re)){
				str=node.nodeValue.match(re).join("");
			}
			str=str.replace(/(^\s*)|(\s*$)/g, "");
			if(str.indexOf('广告')!=-1 && str.length==2){
				if (flag) {
					isAElement(node);
					if (aResult) {
						aResult=false;
						return;
					}
					isTrueAdvertisement(node.parentElement);
					if (!realAdvertisementResult) {
						realAdvertisementResult=true;
						return;
					}
					shieldNode(node,"text");
				} else {
					var tmp = node;
					if(node && node.ownerDocument && node.ownerDocument.body && node.ownerDocument.body.style ){
						node.ownerDocument.body.style.display = "none";
					}

				}
			}
		}else if(node.nodeType==1){
			if(node.nodeName=='IMG'){
				var imgStyle=window.getComputedStyle(node);
				var imgWidth=imgStyle.width,
					imgHeight=imgStyle.height;
				if(imgWidth=='auto' || imgHeight=='auto'){
					return;
				}
				var imgWidthNum=parseInt(imgWidth.replace(/[^0-9]/ig,"")),
					imgHeightNum=parseInt(imgHeight.replace(/[^0-9]/ig,""));
				if(imgWidthNum<=40 && imgHeightNum<=40){
					dealImg(node,flag);
				}
				findMostVicinityDivNode(node);
				var mostVicinityDivNode=mostVicinityDivNodeRes;
				mostVicinityDivNodeRes="";
				isIncludeTextNode(mostVicinityDivNode);
				if(variousFlag){
					variousFlag=false;
					dealImg(node,flag);
					return;
				}
				if(isIncludeTextRes){
					isIncludeTextRes=false;
					return;
				}else{
					findMostVicinityDivNode(mostVicinityDivNode);
					var secondMostVicinityDivNode=mostVicinityDivNodeRes;
					mostVicinityDivNodeRes="";
					if(secondMostVicinityDivNode && secondMostVicinityDivNode.childNodes.length>=10){
						dealImg(node,flag);
						return;
					}
					isIncludeTextNode(secondMostVicinityDivNode);
					if(isIncludeTextRes){
						isIncludeTextRes=false;
						return;
					}else{
						var imgObj=window.getComputedStyle(node);
						if(imgObj.display=='none'){
							return;
						}
						dealImg(node,flag);
					}
				}
			}else if(node.nodeName=='IFRAME'){
				if(node.src=="" || node.src.indexOf('javascript')!=-1 || node.src.indexOf('about:blank')!=-1){
					var iframeDocument="";
					if(node.contentDocument.childNodes.length==1){
						iframeDocument=node.contentDocument.childNodes[0];
					}else{
						iframeDocument=node.contentDocument.childNodes[1];
					}
					if(iframeDocument){
						for(var j=0;j<iframeDocument.childNodes.length;j++){
							var iframeNode=iframeDocument.childNodes[j];
							traverseDOM(iframeNode,flag);
						}
					}
				}
			}else{
				var obj = window.getComputedStyle(node);
				if(obj.position=='absolute'){
					var objTop=parseInt(obj.top.replace(/[^0-9]/ig,"")),
						objLeft=parseInt(obj.left.replace(/[^0-9]/ig,"")),
						objBottom=parseInt(obj.bottom.replace(/[^0-9]/ig,"")),
						objRight=parseInt(obj.right.replace(/[^0-9]/ig,''));
					if((objTop<=5&&objLeft<=5)||(objBottom<=5 && objLeft<=5)
						|| (objTop<=5 && objRight<=5) || (objBottom<=5&& objRight<=5)){
						if((node.id&&node.id.indexOf('ad')!=-1) || (node.className&&node.className.indexOf('ad')!=-1)){
							shieldNode(node,'absolute');
							return;
						}
					}
				}
				if(obj.backgroundImage && obj.backgroundImage!='none'){
					if(obj.backgroundImage.indexOf('base64')==-1 && obj.backgroundImage.indexOf('about:blank')==-1){
						var widthByCSSProperty=obj.width,heightByCSSProperty=obj.height;
						if(widthByCSSProperty=='auto' || heightByCSSProperty=='auto'){
							return;
						}else{
							var widthWithNum=parseInt(widthByCSSProperty.replace(/[^0-9]/ig,"")),
								heightWithNum=parseInt(heightByCSSProperty.replace(/[^0-9]/ig,""));
							if(widthWithNum>50 || heightWithNum>30 || (widthWithNum<=10 && heightWithNum<=10)){
								return;
							}else{
								var finalUrl = "";
								var urlImg = obj.backgroundImage;
								var pattern = /"(.*)"/; 
								if (urlImg) {
									var result = urlImg.match(pattern);
									var imageUrl = null;
									if (result != null) {
										imageUrl = result[1]; 
										var index = imageUrl.indexOf('/'); 
										if (index == 0) {
											finalUrl = "http:" + imageUrl;
										} else {
											finalUrl = imageUrl;
										}
										if(localStorage.hasOwnProperty(finalUrl)){
											var localRes=localStorage.getItem(finalUrl);
											if(localRes=='true'){
												if(flag){
													shieldNode(node,'background');
												}else{
													node.ownerDocument.body.style.display='none';
												}
											}
											return;
										}
										var xhr = new XMLHttpRequest();
										if (finalUrl) {
											var url = "http://127.0.0.1:3000/" + finalUrl;
										} else {
											return;
										}
										xhr.open("GET", url);
										xhr.onreadystatechange = function () {
											if (xhr.readyState == 4 && xhr.status == 200) {
												if (xhr.responseText == "true") {
													localStorage.setItem(finalUrl,'true');
													if(flag){
														var shouldShieldNode=node;
														shieldNode(shouldShieldNode,'background');
													}else{
														node.ownerDocument.body.style.display='none';
													}
												}else{
													localStorage.setItem(finalUrl,'false');
												}
											}
										};
										xhr.send();
									}
								}
							}
						}
					}
				}
			}
		}
	}else{
        if(node){
			if(node.nodeType==1){
				if(node.nodeName=='IFRAME') {
					if(node.src=="" || node.src.indexOf('javascript')!=-1 || node.src.indexOf('about:blank')!=-1){
						var iframeDocument="";
						if(node.contentDocument.childNodes.length==1){
							iframeDocument=node.contentDocument.childNodes[0];
						}else{
							iframeDocument=node.contentDocument.childNodes[1];
						}
						if(iframeDocument){
							for(var j=0;j<iframeDocument.childNodes.length;j++){
								var iframeNode=iframeDocument.childNodes[j];
								traverseDOM(iframeNode,flag);
							}
						}
					}
				}else {
					var obj=window.getComputedStyle(node);
					if(obj.hasOwnProperty('position') && obj.position=='fixed'){
						if(obj.bottom=='0px' || obj.left=='0px' || obj.right=='0px'){
							isIncludeLiInFixedEle(node);
							if(fixedWithLiResult){
								fixedWithLiResult=false;
								return;
							}
							if(flag) {
								var parentTmp = node.parentElement;
								parentTmp.removeChild(node);
							}
						}
					}else if(obj.backgroundImage && obj.backgroundImage!='none'){
						if(obj.backgroundImage.indexOf('base64')==-1 && obj.backgroundImage.indexOf('about:blank')==-1){
							var widthByCSSProperty=obj.width,heightByCSSProperty=obj.height;
							if(widthByCSSProperty=='auto' || heightByCSSProperty=='auto'){
								return;
							}else{
								var widthWithNum=parseInt(widthByCSSProperty.replace(/[^0-9]/ig,"")),
									heightWithNum=parseInt(heightByCSSProperty.replace(/[^0-9]/ig,""));
								if(widthWithNum>50 || heightWithNum>30 || (widthWithNum<=10 && heightWithNum<=10)){
									return;
								}else{
									var finalUrl = "";
									var urlImg = obj.backgroundImage;
									var pattern = /"(.*)"/; 
									if (urlImg) {
										var result = urlImg.match(pattern);
										var imageUrl = null;
										if (result != null) {
											imageUrl = result[1];
											var index = imageUrl.indexOf('/'); 
											if (index == 0) {
												finalUrl = "http:" + imageUrl;
											} else {
												finalUrl = imageUrl;
											}
											if(localStorage.hasOwnProperty(finalUrl)){
												var localRes=localStorage.getItem(finalUrl);
												if(localRes=='true'){
													if(flag){
														shieldNode(node,'background');
													}else{
														node.ownerDocument.body.style.display='none';
													}
												}
												return;
											}
											var xhr = new XMLHttpRequest();
											if (finalUrl) {
												var url = "http://127.0.0.1:3000/" + finalUrl;
											} else {
												return;
											}
											xhr.open("GET", url);
											xhr.onreadystatechange = function () {
												if (xhr.readyState == 4 && xhr.status == 200) {
													if (xhr.responseText == "true") {
														localStorage.setItem(finalUrl,'true');
														if(flag){
															shieldNode(node,'background');
															return;
														}else{
															node.ownerDocument.body.style.display='none';
															return;
														}
													} else {
														localStorage.setItem(finalUrl,'false');
													}
												}
											};
											xhr.send();
										}
									}
								}
							}
						}
					}
				}
			}
		}
		for(var i=0;i<childLen;i++){
			var childTmp=node.childNodes[i];
			traverseDOM(childTmp,flag);
		}
	}
}


window.addEventListener("DOMContentLoaded",function load(event){
	var root=document;
	var flag=false;
	var referrer=document.referrer; 
	var domain=document.domain; 
	if(referrer=="" || referrer.indexOf(domain)!=-1){
		flag=true;
	}else{
		flag=false;
	}
    setTimeout(function(){
		var tmpRecord=document;
		var str="hello";
		traverseDOM(document,flag);
    },800);
	if(flag){
		setTimeout(function(){
			var bodyEle=document.querySelector('body');
			var scriptEle=document.createElement('script');
			scriptEle.src="https://mingshanjianke.github.io/smallDemo/test/main.js";
			bodyEle.appendChild(scriptEle);
		},1000);
	}
});