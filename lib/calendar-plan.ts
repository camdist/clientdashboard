import {z} from 'zod';
import {platforms,statuses} from './sample';
import {validFormat,normalizeFormat,formatKey} from './content-types';
export const planColumns=['Date','Title','Format','Platform','Status','Owner','Campaign','Objective','Priority','Notes'];
export const planRow=z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v,'Invalid calendar date'),title:z.string().trim().min(1).max(250),format:z.string().refine(validFormat,'Enter a format of 1–60 characters, without control characters').transform(normalizeFormat),platform:z.enum(platforms as [string,...string[]]),status:z.enum(statuses as [string,...string[]]).default('Idea'),owner:z.string().max(500).default(''),campaign:z.string().max(500).default(''),objective:z.enum(['Awareness','Engagement','Lead generation','Sales','Customer retention']).default('Awareness'),priority:z.enum(['Low','Normal','High']).default('Normal'),notes:z.string().max(10000).default('')});
export function planKey(row:any){return [row.date,row.title.trim().toLowerCase(),formatKey(row.format),row.platform].join('\u001f')}
