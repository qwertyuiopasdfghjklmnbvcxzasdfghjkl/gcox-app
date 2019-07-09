export default function(args){
  let tclass = args.type || 'info', ttitle = args.title || '', tcontent = args.message || '', tdelay = args.delay || 3000
  let exsistTip = $('body .tip')
  if(exsistTip.length){
    exsistTip.remove()
  }
  let _html =`
    <div class="tip tip-${tclass}">
      <span><strong>${ttitle}</strong> ${tcontent}</span>
    </div>
  `
  _html = $(_html)
  $('body').append(_html)
  setTimeout(()=>{
    _html.css({'z-index':'99999', 'opacity':'1'})
  },0)
  setTimeout(()=>{
    _html.one('webkitTransitionEnd transitionend', ()=>{
      _html.removeAttr('style')
    })
    _html.css({'opacity':'0'})
  },tdelay)
}