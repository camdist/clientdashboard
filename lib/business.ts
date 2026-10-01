import {z} from 'zod';
export const businessViews=['Business overview','Clients','Projects','Tasks','Payments','Customize','Themes','Owner guide'];
export {default as themes} from './theme-catalog.json';
import themes from './theme-catalog.json';
export const clientStages=['Lead','Contacted','Proposal sent','Active','On hold','Closed'];
export const projectStages=['Planning','In progress','Waiting for client','Completed','Cancelled'];
export const taskStages=['To do','In progress','Done'];
export const currencies=['PHP','USD','EUR','GBP','AUD','CAD','SGD'];
export const moduleNames=['Projects','Tasks','Payments','Content'];
export const widgetNames=['Client pipeline','Projects and tasks','Payment summary','Monthly content'];
export const defaults={id:'workspace-settings',kind:'settings',client:'',name:'Client Dashboard',industry:'Services',currency:'PHP',theme:'executive',density:'Comfortable',defaultOwner:'',monthlyGoal:0,modules:moduleNames,widgets:widgetNames,customFields:[],customAccent:'',logo:'',businessEmail:'',businessAddress:'',invoiceDueDays:14,invoiceTaxRate:0,invoiceTerms:''};
const date=z.string().refine(v=>!v||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v),'Use a valid date');
const txt=z.string().max(500).default('');const amount=z.number().finite().nonnegative().max(1e12);
const logo=z.string().max(200000).refine(v=>!v||/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(v),'Use a PNG or JPG logo').default('');
const line=z.object({description:z.string().trim().min(1).max(500),quantity:z.number().finite().positive().max(1e6),rate:amount});
const base={id:z.string().min(1).max(100),client:z.string().max(100)};
export const businessSchema=z.discriminatedUnion('kind',[
 z.object({...base,kind:z.literal('client'),logo,billingAddress:txt,name:z.string().trim().min(1).max(200),description:txt,contact:txt,email:z.union([z.literal(''),z.string().email()]).default(''),phone:txt,website:z.union([z.literal(''),z.string().url().regex(/^https?:\/\//)]).default(''),stage:z.enum(clientStages as [string,...string[]]).default('Lead'),source:txt,owner:txt,nextFollowup:date.default(''),value:amount.default(0),valueCurrency:z.enum(currencies as [string,...string[]]).default('PHP'),notes:z.string().max(10000).default(''),custom:z.record(z.string().max(1000)).default({})}).passthrough(),
 z.object({...base,kind:z.literal('project'),title:z.string().trim().min(1).max(250),status:z.enum(projectStages as [string,...string[]]),date,budget:amount,currency:z.enum(currencies as [string,...string[]]),owner:txt,notes:z.string().max(10000).default('')}),
 z.object({...base,kind:z.literal('task'),title:z.string().trim().min(1).max(250),status:z.enum(taskStages as [string,...string[]]),date,priority:z.enum(['Low','Normal','High']),owner:txt,projectId:txt,contentId:txt,notes:z.string().max(10000).default('')}),
 z.object({...base,kind:z.literal('invoice'),lineItems:z.array(line).min(1).max(100).optional(),discount:amount.default(0),taxRate:z.number().finite().min(0).max(100).default(0),issuedDate:date.optional(),terms:z.string().max(5000).default(''),title:z.string().trim().min(1).max(250),date:date.refine(v=>!!v,'Due date is required'),amount,paid:amount,currency:z.enum(currencies as [string,...string[]]),status:z.enum(['Draft','Sent','Cancelled']),projectId:txt,notes:z.string().max(10000).default('')}),
 z.object({...base,kind:z.literal('settings'),logo,businessEmail:z.union([z.literal(''),z.string().email()]).default(''),businessAddress:txt,invoiceDueDays:z.number().int().min(0).max(365).default(14),invoiceTaxRate:z.number().finite().min(0).max(100).default(0),invoiceTerms:z.string().max(5000).default(''),name:z.string().trim().min(1).max(120),industry:txt,currency:z.enum(currencies as [string,...string[]]),theme:z.enum(themes.map(t=>t.id) as [string,...string[]]),density:z.enum(['Comfortable','Compact']),defaultOwner:txt,monthlyGoal:amount,modules:z.array(z.enum(moduleNames as [string,...string[]])).max(4),widgets:z.array(z.enum(widgetNames as [string,...string[]])).max(4),customFields:z.array(z.string().trim().min(1).max(50)).max(8),customAccent:z.union([z.literal(''),z.string().regex(/^#[0-9a-fA-F]{6}$/)])})
]);
