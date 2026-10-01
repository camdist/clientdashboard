export type InvoiceLine={description:string;quantity:number;rate:number};
export function invoiceTotals(lines:InvoiceLine[],discount=0,taxRate=0){
 const subtotal=lines.reduce((sum,l)=>sum+Math.round(l.quantity*l.rate*100),0);
 const discountCents=Math.round(discount*100),taxable=Math.max(0,subtotal-discountCents);
 const tax=Math.round(taxable*taxRate/100);
 return {subtotal:subtotal/100,discount:discountCents/100,tax:tax/100,amount:(taxable+tax)/100};
}
export function invoiceLines(r:any):InvoiceLine[]{return r.lineItems?.length?r.lineItems:[{description:r.title||'Services',quantity:1,rate:r.amount||0}]}
