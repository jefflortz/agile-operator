import{a_ as F,aN as w,b5 as S,aE as e,c as I,aY as y,ax as i}from"./sanity-DAsMoORO.js";var R=i.div`
  max-width: 600px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
`,D=i.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,L=i.div`
  padding: 16px;
`,M=i.p`
  margin: 0 0 4px;
  color: #006621;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
`,V=i.h3`
  margin: 0 0 8px;
  color: #1a0dab;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }
`,Y=i.p`
  margin: 0;
  color: #545454;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,q=i.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4f46e5;
  background: #f0f4ff;
  padding: 4px 8px;
  border-radius: 4px;
`,A=k=>{var f,u,x,h;const{path:j,schemaType:T}=k,{options:t}=T,U=(t==null?void 0:t.baseUrl)||"https://www.example.com",g=t==null?void 0:t.prefix,n=t==null?void 0:t.titleSuffix,P=(f=t==null?void 0:t.titleSuffixInheritColor)!=null?f:!1,o=t==null?void 0:t.titleSuffixQuery,v=F({apiVersion:(u=t==null?void 0:t.apiVersion)!=null?u:"2024-01-01"}),[$,m]=w.useState("");w.useEffect(()=>{o&&v.fetch(o).then(r=>{m(r==null?"":String(r))}).catch(()=>{m("")})},[o,v]);const _=S([j[0]])||{title:"",description:"",canonicalUrl:""},l=S([])||{slug:{current:""}},z=((x=l==null?void 0:l.slug)==null?void 0:x.current)||"",{title:c,description:p,canonicalUrl:C}=_,a=o?$:n?typeof n=="function"?n(l):n:"",d=(h=C||U)==null?void 0:h.replace(/\/+$/,""),E=String(z||"").replace(/^\/+/,""),s=[String(g?g(l):"").replace(/^\/+|\/+$/g,""),E].filter(Boolean).join("/"),b=s?`${d}/${s}`:d,B=`${(()=>{try{return new URL(b||d).hostname}catch{return"example.com"}})()}${s?` › ${s.split("/").slice(-1)[0]}`:""}`;return e.jsx(I,{padding:3,children:e.jsxs(R,{children:[e.jsxs(D,{children:[e.jsx("span",{style:{fontSize:"11px",color:"#5f6368",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Search Preview"}),e.jsxs(q,{children:[e.jsx("span",{style:{width:"4px",height:"4px",borderRadius:"50%",backgroundColor:"#4f46e5",display:"inline-block"}}),"Live"]})]}),e.jsxs(L,{children:[e.jsx(M,{children:b?B:"example.com › page-url"}),e.jsx(V,{children:c&&c.length>0?e.jsxs(e.Fragment,{children:[y(c,Math.max(1,60-(a?a.length+3:0))),a&&e.jsxs("span",{style:P?void 0:{color:"#70757a",fontWeight:400},children:[" ","| ",a]})]}):"Your SEO Title will appear here"}),e.jsx(Y,{children:p&&p.length>0?y(p,160):"Your meta description will show up here. Make it compelling!"})]})]})})},N=A;export{N as default};
