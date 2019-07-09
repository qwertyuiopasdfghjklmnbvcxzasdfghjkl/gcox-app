export default function(args){
  var tclass = args.type || 'info', ttitle = args.title || '', tcontent = args.message || ''
  var exsistTip = $('body .tip')
  if(exsistTip.length){
    exsistTip.remove()
  }
  var _html =`
    <div class="tip tip-${tclass}">
      <p><strong>${ttitle}</strong> ${tcontent}</p>
    </div>
  `
  _html = $(_html)
  $('body').append(_html)
  setTimeout(()=>{
    _html.css({'opacity':'1','top':'0'})
  },0)
  setTimeout(()=>{
    _html.removeAttr('style')
  },3500)
}
