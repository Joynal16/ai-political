import 'dotenv/config';
import { connectDb } from './config/db';
import { Template } from './models/Template';
import { User } from './models/User';
import bcrypt from 'bcryptjs';

const templates = [
  {
    title: 'Victory Day', occasionType: 'বিজয় দিবস',
    thumbnailUrl: '',
    layoutConfig: {
      width: 1200, height: 1600, background: 'linear-gradient(145deg,#eef7ed,#fffdf5)', accent: '#146b3a', headlineColor: '#0b4b2a', footerColor: '#103a27',
      photoSlots: [{x:130,y:155,w:430,h:330,radius:24},{x:640,y:155,w:430,h:330,radius:24},{x:385,y:930,w:430,h:330,radius:24}],
      decorations: ['flag-ribbon','floral','rice-paddy']
    }
  },
  {
    title: 'Tribute / Condolence', occasionType: 'শোক / স্মরণ',
    thumbnailUrl: '',
    layoutConfig: {
      width: 1200, height: 1600, background: 'linear-gradient(145deg,#f1f1f1,#ffffff)', accent: '#333333', headlineColor: '#202020', footerColor: '#303030',
      photoSlots: [{x:385,y:170,w:430,h:430,radius:215},{x:200,y:760,w:350,h:280,radius:22},{x:650,y:760,w:350,h:280,radius:22}],
      decorations: ['dove','floral']
    }
  },
  {
    title: 'Campaign / Publicity', occasionType: 'নির্বাচনী প্রচার',
    thumbnailUrl: '',
    layoutConfig: {
      width: 1200, height: 1600, background: 'linear-gradient(155deg,#fff9ea,#edf8f0)', accent: '#b88916', headlineColor: '#7a5200', footerColor: '#4b3a13',
      photoSlots: [{x:110,y:170,w:310,h:310,radius:155},{x:445,y:145,w:310,h:310,radius:155},{x:780,y:170,w:310,h:310,radius:155}],
      decorations: ['flag-ribbon','rice-paddy']
    }
  }
];

async function main() {
  await connectDb(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-political-poster-maker');
  await Template.deleteMany({});
  await Template.insertMany(templates);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const exists = await User.findOne({ emailOrPhone: email });
  if (!exists) await User.create({ name: 'Admin', emailOrPhone: email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12), role: 'admin' });
  console.log('Seed complete');
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
