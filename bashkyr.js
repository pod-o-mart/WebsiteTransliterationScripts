// ==UserScript==
// @name            Bashkyr Cyrillic to Latin (dev)
// @description     Web site conversion of Bashkyr Cyrillic to Latin (beta)
// @source          https://userscripts-mirror.org./scripts/show/89962
// @identifier      https://userscripts-mirror.org./scripts/source/89962.user.js
// @version         0.1
// @date            2010-11-07
// @author          Martin Podolak
// @namespace       http://podolak.net/translit
// @include         *
// ==/UserScript==


/*
Based on Pridelands.ru - Polsko Rosyjska transliteracja (transkrypcja) + Tłumaczenie menu 0.7 BETA by Nitrol (https://userscripts-mirror.org./scripts/show/80413)
*/

var words = {};

String.prototype.prepareRegex = function() {
return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
var ok = true;
var badTags = new Array('pre','blockquote','code','input','button','textarea');
for each(var badTag in badTags) if(tag==badTag) ok=false;
return ok;
}

var regexs=new Array(),
	replacements=new Array();
for(var word in words) {
regexs.push(new RegExp(word.prepareRegex().replace(/\*/g,'[^ ]*'), 'gi'));
replacements.push(words[word]);
}

var texts = document.evaluate("//text()[normalize-space(.)!='']",document,null,6,null), text="";
for(var i=0,l=texts.snapshotLength; (this_text=texts.snapshotItem(i)); i++) {
	if(isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text=this_text.textContent)) {
	for(var x=0; x<regexs.length; x++) text = text.replace(regexs[x], replacements[x]);
	this_text.textContent = text;
	}
}

transliterate_rus1 = true;

transliterate_rus2 = true;

var obstring = 'var transliterations = {';
if(transliterate_rus1 == true)
	{
	obstring +=	'А:"A", а:"a", Б:"B", б:"b", В:"V", в:"v", Г:"G", г:"g", Д:"D", д:"d", Е:"E", е:"e", Ж:"Ƶ", ж:"ƶ", Җ:"C", җ:"c", З:"Z", з:"z", И:"I", и:"i", Й:"J", й:"j", К:"K", к:"k", Л:"L", л:"l", М:"M", м:"m", Н:"N", н:"n", О:"O", о:"o", Ө:"Ö", ө:"ö", П:"P", п:"p", Р:"R", р:"r", С:"S", с:"s", Т:"T", т:"t", У:"U", у:"u", Ү:"Ü", ү:"ü", Ф:"F", ф:"f", Х:"x", х:"x", Һ:"H", һ:"h", Ц:"Ts", ц:"ts", Ч:"C", ч:"c", Ш:"Ş", ш:"ş", Щ:"Şç", щ:"şç", Ъ:"’", ъ:"’", Ы:"Ь", ы:"ь", Һ:"H", Э:"E", э:"e", Ю:"Yu", ю:"yu", Я:"Ya", я:"ya", Ғ:"Ƣ", ғ:"ƣ", Ҙ:"Đ", ҙ:"đ", Ҡ:"Q", ҡ:"q", Ң:"N̡", ң:"n̡", Ѣ:"Ҫ", ѣ:"ҫ",';
	}

if(transliterate_rus2 == true)	
	{	

	}

obstring += '};';
eval(obstring);

function defined(v)
	{
	return v != undefined;
	}

function translate(text)
	{
	if(!defined(text) || !text.match) 
		return undefined;
	
//	text = text.replace(/^\s*/, "").replace(/\s*$/, "");

	if(text == "")
		return undefined;

	var translation = "";

	for(var i = 0; i < text.length; i++)
		{
		rus1 = text.charAt(i);

		transliteration = transliterations[rus1];

		if(defined(transliteration))
			translation += transliteration;

		else
			translation += rus1;
		}
	
	return translation;
	}

function translateTree(a)
	{
	var items = document.evaluate("descendant::*", a, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	
	for(var i = 0; i < items.snapshotLength; i++)
		{
		var e = items.snapshotItem(i);
		
		for(var j = 0; j < e.childNodes.length; j++)
			{
			var elem = e.childNodes[j];

			if(elem.nodeType == 3)
				{
				var text = translate(elem.wholeText);
				if(defined(text))
					elem.replaceWholeText(text);
				} 

			else
				{
				var text = translate(elem.value);
				if(defined(text))
					elem.value = text;
				}
			}
		}
	}

translateTree(document.body);
