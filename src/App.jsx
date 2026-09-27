import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

const h = React.createElement;
let uid=1;
const STORE_KEY='covermaker_draft_v1';
const CW=794,CH=1123;

const FONTS=[
 {v:"'Inter',sans-serif",l:'Inter'},
 {v:"'Hind Siliguri','Inter',sans-serif",l:'Hind Siliguri'},
 {v:"'Lora',serif",l:'Lora'},
 {v:'Georgia,serif',l:'Georgia'},
 {v:'Arial,sans-serif',l:'Arial'},
 {v:"'Times New Roman',serif",l:'Times New Roman'}
];

const LANGS={
 en:{name:'English',brand:'Cover Maker',addText:'Text',addBox:'Box',addLine:'Line',addLogo:'Logo',preset:'Templates',pdf:'Download PDF',png:'PNG',select:'Select an element to edit, drag it on the canvas, or use the keyboard shortcuts below.',text:'Text',fontSize:'Font size',color:'Color',align:'Alignment',left:'Left',center:'Center',right:'Right',bold:'Bold',border:'Border width',radius:'Corner radius',width:'Width',height:'Height',delete:'Delete',dup:'Duplicate',front:'Bring front',removeBg:'Remove background',sharpen:'Sharpen',imgTools:'Image tools',restore:'Restore original',removing:'Working...',ff:'Font',ital:'Italic',und:'Underline',undo:'Undo',redo:'Redo',newProj:'New',bg:'Canvas background',tThesis:'Thesis Cover',tAssign:'Assignment Cover',tLab:'Lab Report Cover',saved:'Draft saved',confirmNew:'Start a new blank cover? Current work will be cleared.',customBg:'Remove a specific leftover color',eyedrop:'🎯 Pick from image',tolerance:'Tolerance',applyCustom:'Remove this color',manualErase:'Manual erase',confirmTemplate:'Use this template? Current work on the canvas will be replaced.',cancel:'Cancel',ok:'OK'},
 bn:{name:'বাংলা',brand:'কভার মেকার',addText:'টেক্সট',addBox:'বক্স',addLine:'লাইন',addLogo:'লোগো',preset:'টেমপ্লেট',pdf:'PDF ডাউনলোড',png:'PNG',select:'সম্পাদনার জন্য একটি এলিমেন্ট নির্বাচন করুন বা টেনে সরান।',text:'টেক্স্ট',fontSize:'ফন্ট সাইজ',color:'রঙ',align:'অ্যালাইনমেন্ট',left:'বামে',center:'মাঝে',right:'ডানে',bold:'বোল্ড',border:'বর্ডার পুরুত্ব',radius:'কর্নার রাউন্ড',width:'প্রস্থ',height:'উচ্চতা',delete:'মুছুন',dup:'কপি',front:'সামনে আনুন',removeBg:'ব্যাকগ্রাউন্ড রিমুভ',sharpen:'পরিষ্কার করুন',imgTools:'ছবি টুলস',restore:'মূল ছবি ফিরিয়ে আনুন',removing:'কাজ চলছে...',ff:'ফন্ট',ital:'ইটালিক',und:'আন্ডারলাইন',undo:'ফিরিয়ে নিন',redo:'পুনরায় করুন',newProj:'নতুন',bg:'ক্যানভাস ব্যাকগ্রাউন্ড',tThesis:'থিসিস কভার',tAssign:'অ্যাসাইনমেন্ট কভার',tLab:'ল্যাব রিপোর্ট কভার',saved:'সংরক্ষিত হয়েছে',confirmNew:'নতুন খালি কভার শুরু করবেন? বর্তমান কাজ মুছে যাবে।',customBg:'নির্দিষ্ট অবশিষ্ট রঙ মুছুন',eyedrop:'🎯 ছবি থেকে তুলুন',tolerance:'সহনশীলতা',applyCustom:'এই রঙ মুছে দিন',manualErase:'নিজ হাতে মুছুন',confirmTemplate:'এই টেমপ্লেট ব্যবহার করবেন? ক্যানভাসের বর্তমান কাজ মুছে যাবে।',cancel:'বাতিল',ok:'ঠিক আছে'},
 hi:{name:'हिन्दी',brand:'कवर मेकर',addText:'टेक्स्ट',addBox:'बॉक्स',addLine:'लाइन',addLogo:'लोगो',preset:'टेम्पलेट',pdf:'PDF डाउनलोड',png:'PNG',select:'संपादन के लिए एक तत्व चुनें या खींचें।',text:'टेक्स्ट',fontSize:'फॉन्ट आकार',color:'रंग',align:'संरेखण',left:'बाएँ',center:'केंद्र',right:'दाएँ',bold:'बोल्ड',border:'बॉर्डर',radius:'कोना',width:'चौड़ाई',height:'ऊँचाई',delete:'हटाएं',dup:'डुप्लिकेट',front:'आगे लाएं',removeBg:'फिर हटाएं',restore:'मूल लौटाएं',removing:'हो रहा है...',ff:'फॉन्ट',ital:'इटैलिक',und:'अंडरलाइन',undo:'पूर्ववत करें',redo:'फिर से करें',newProj:'नया',bg:'पृष्ठभूमि',tThesis:'थीसिस कवर',tAssign:'असाइनमेंट कवर',tLab:'लैब रिपोर्ट कवर',saved:'सहेजा गया',confirmNew:'नया खाली कवर शुरू करें? मौजूदा काम मिट जाएगा।'},
 ur:{name:'اردو',brand:'کور میکر',addText:'ٹیکسٹ',addBox:'باکس',addLine:'لائن',addLogo:'لوگو',preset:'ٹیمپلیٹس',pdf:'PDF ڈاؤن لوڈ',png:'PNG',select:'ترمیم کے لیے عنصر منتخب کریں یا گھسیٹیں۔',text:'متن',fontSize:'فونٹ سائز',color:'رنگ',align:'ترتیب',left:'بائیں',center:'درمیان',right:'دائیں',bold:'بولڈ',border:'بارڈر',radius:'کونا',width:'چوڑائی',height:'اونچائی',delete:'حذف کریں',dup:'نقل',front:'آگے لائیں',removeBg:'دوبارہ ہٹائیں',restore:'اصل بحال کریں',removing:'جاری ہے...',ff:'فونٹ',ital:'ترچھا',und:'انڈر لائن',undo:'واپس کریں',redo:'دوبارہ کریں',newProj:'نیا',bg:'پس منظر',tThesis:'تھیسس کور',tAssign:'اسائنمنٹ کور',tLab:'لیب رپورٹ کور',saved:'محفوظ ہو گیا',confirmNew:'نیا خالی کور شروع کریں؟ موجودہ کام مٹ جائے گا۔'},
 ar:{name:'العربية',brand:'صانع الغلاف',addText:'نص',addBox:'مربع',addLine:'خط',addLogo:'شعار',preset:'قوالب',pdf:'تحميل PDF',png:'PNG',select:'اختر عنصرًا للتعديل أو اسحبه.',text:'نص',fontSize:'حجم الخط',color:'اللون',align:'المحاذاة',left:'يسار',center:'وسط',right:'يمين',bold:'عريض',border:'سمك الحدود',radius:'استدارة الزاوية',width:'العرض',height:'الارتفاع',delete:'حذف',dup:'نسخ',front:'إحضار للأمام',removeBg:'إزالة مجددًا',restore:'استعادة الأصل',removing:'جارٍ التنفيذ...',ff:'الخط',ital:'مائل',und:'تسطير',undo:'تراجع',redo:'إعادة',newProj:'جديد',bg:'الخلفية',tThesis:'غلاف أطروحة',tAssign:'غلاف واجب',tLab:'غلاف تقرير مخبري',saved:'تم الحفظ',confirmNew:'بدء غلاف جديد فارغ؟ سيُحذف العمل الحالي.'},
 es:{name:'Español',brand:'Creador de Portadas',addText:'Texto',addBox:'Caja',addLine:'Línea',addLogo:'Logo',preset:'Plantillas',pdf:'Descargar PDF',png:'PNG',select:'Selecciona un elemento para editar o arrástralo.',text:'Texto',fontSize:'Tamaño',color:'Color',align:'Alineación',left:'Izq',center:'Centro',right:'Der',bold:'Negrita',border:'Borde',radius:'Redondez',width:'Ancho',height:'Alto',delete:'Eliminar',dup:'Duplicar',front:'Al frente',removeBg:'Quitar de nuevo',restore:'Restaurar original',removing:'Trabajando...',ff:'Fuente',ital:'Cursiva',und:'Subrayado',undo:'Deshacer',redo:'Rehacer',newProj:'Nuevo',bg:'Fondo del lienzo',tThesis:'Portada de Tesis',tAssign:'Portada de Tarea',tLab:'Portada de Informe',saved:'Borrador guardado',confirmNew:'¿Iniciar una portada nueva? Se borrará el trabajo actual.'},
 fr:{name:'Français',brand:'Créateur de Couverture',addText:'Texte',addBox:'Boîte',addLine:'Ligne',addLogo:'Logo',preset:'Modèles',pdf:'Télécharger PDF',png:'PNG',select:'Sélectionnez un élément à modifier ou déplacez-le.',text:'Texte',fontSize:'Taille',color:'Couleur',align:'Alignement',left:'Gauche',center:'Centre',right:'Droite',bold:'Gras',border:'Bordure',radius:'Arrondi',width:'Largeur',height:'Hauteur',delete:'Supprimer',dup:'Dupliquer',front:'Premier plan',removeBg:'Enlever à nouveau',restore:'Restaurer original',removing:'En cours...',ff:'Police',ital:'Italique',und:'Souligné',undo:'Annuler',redo:'Rétablir',newProj:'Nouveau',bg:'Fond du canevas',tThesis:'Couverture de thèse',tAssign:'Couverture de devoir',tLab:'Couverture de rapport',saved:'Brouillon enregistré',confirmNew:'Commencer une nouvelle couverture ? Le travail actuel sera effacé.'},
 zh:{name:'中文',brand:'封面制作',addText:'文本',addBox:'方框',addLine:'线条',addLogo:'徽标',preset:'模板',pdf:'下载PDF',png:'PNG',select:'选择一个元素进行编辑或拖动。',text:'文本',fontSize:'字号',color:'颜色',align:'对齐',left:'左',center:'中',right:'右',bold:'加粗',border:'边框',radius:'圆角',width:'宽度',height:'高度',delete:'删除',dup:'复制',front:'置于顶层',removeBg:'再次去除',restore:'恢复原图',removing:'处理中...',ff:'字体',ital:'斜体',und:'下划线',undo:'撤销',redo:'重做',newProj:'新建',bg:'画布背景',tThesis:'论文封面',tAssign:'作业封面',tLab:'实验报告封面',saved:'已自动保存',confirmNew:'开始新的空白封面？当前工作将被清除。'},
 ja:{name:'日本語',brand:'カバーメーカー',addText:'テキスト',addBox:'ボックス',addLine:'ライン',addLogo:'ロゴ',preset:'テンプレート',pdf:'PDFダウンロード',png:'PNG',select:'編集する要素を選択するか、ドラッグしてください。',text:'テキスト',fontSize:'フォントサイズ',color:'色',align:'配置',left:'左',center:'中央',right:'右',bold:'太字',border:'枠線',radius:'角丸',width:'幅',height:'高さ',delete:'削除',dup:'複製',front:'最前面へ',removeBg:'再削除',restore:'元画像に戻す',removing:'処理中...',ff:'フォント',ital:'斜体',und:'下線',undo:'元に戻す',redo:'やり直す',newProj:'新規',bg:'キャンバス背景',tThesis:'論文カバー',tAssign:'課題カバー',tLab:'実験報告カバー',saved:'保存しました',confirmNew:'新しい空のカバーを開始しますか？現在の作業は消去されます。'},
 ru:{name:'Русский',brand:'Конструктор обложек',addText:'Текст',addBox:'Блок',addLine:'Линия',addLogo:'Лого',preset:'Шаблоны',pdf:'Скачать PDF',png:'PNG',select:'Выберите элемент для редактирования или перетащите его.',text:'Текст',fontSize:'Размер шрифта',color:'Цвет',align:'Выравнивание',left:'Слева',center:'Центр',right:'Справа',bold:'Жирный',border:'Граница',radius:'Скругление',width:'Ширина',height:'Высота',delete:'Удалить',dup:'Дублировать',front:'Вперёд',removeBg:'Удалить снова',restore:'Восстановить',removing:'Обработка...',ff:'Шрифт',ital:'Курсив',und:'Подчёркнутый',undo:'Отменить',redo:'Повторить',newProj:'Новый',bg:'Фон холста',tThesis:'Обложка диссертации',tAssign:'Обложка задания',tLab:'Обложка лабораторного отчёта',saved:'Черновик сохранён',confirmNew:'Начать новую пустую обложку? Текущая работа будет удалена.'}
};

function newText(t,x,y,fs,bold,w,ff,it,un){return{id:uid++,z:uid,type:'text',x,y,w:w||360,h:(fs||20)+24,text:t,fontSize:fs||20,bold:!!bold,italic:!!it,underline:!!un,align:'left',color:'#1b1b1b',fontFamily:ff||"'Inter',sans-serif"};}
function newShape(x,y){return{id:uid++,z:uid,type:'shape',x,y,w:220,h:120,color:'#33407a',border:2,radius:0};}
function newLine(x,y){return{id:uid++,z:uid,type:'line',x,y,w:320,h:2,color:'#1b1b1b',border:3};}

function defaultEls(){
  return [
    newText('THESIS / REPORT TITLE',100,380,30,true,560),
    newText('Student Name: ',150,500,17),
    newText('ID No: ',150,540,17),
    newText('Department: ',150,580,17),
    newText('Institution Name',150,900,16)
  ];
}

// Template gallery. Each entry is a full, ready-to-use cover layout - not
// just a re-labeled text block, but its own color accent + typography +
// arrangement, so browsing the gallery actually shows visually distinct
// options like the template libraries in competing cover-page tools.
// `layout` only drives the little mock preview drawn in the gallery card;
// `build()` returns the real elements dropped onto the canvas.
function tpl(id,labelEn,labelBn,accent,layout,bg,build){return{id,labelEn,labelBn,accent,layout,bg,build};}
const TEMPLATES=[
  tpl('thesis-classic','Thesis — Classic','থিসিস — ক্লাসিক','#33407a','topbar','#ffffff',accent=>[
    {...newLine(0,0),w:CW,h:14,color:accent},
    newText('UNIVERSITY / INSTITUTION NAME',90,58,20,true,600,"'Lora',serif"),
    newText('Department Name',90,96,15),
    {...newLine(90,148),w:600,h:3,color:accent},
    newText('Thesis Report Title',90,420,30,true,600,"'Lora',serif"),
    newText('Submitted by:',110,610,16,true),
    newText('Name: ',130,645,15),
    newText('ID: ',130,675,15),
    newText('Submitted to:',450,610,16,true),
    newText('Name: ',470,645,15),
    newText('Designation: ',470,675,15),
    newText('Date of Submission: ',110,1030,15)
  ]),
  tpl('thesis-modern','Thesis — Modern','থিসিস — মডার্ন','#0f766e','sidebar','#ffffff',accent=>[
    {...newLine(0,0),w:16,h:CH,color:accent},
    newText('THESIS',64,80,34,true,500),
    newText('Institution Name',64,140,16),
    newText('Department',64,170,14),
    newText('Report Title Goes Here',64,440,26,true,560),
    newText('Submitted by',84,650,15,true),
    newText('Name: ',104,682,14),
    newText('ID: ',104,710,14),
    newText('Supervisor',460,650,15,true),
    newText('Name: ',480,682,14),
    newText('Date: ',64,1040,14)
  ]),
  tpl('assignment-simple','Assignment — Simple','অ্যাসাইনমেন্ট — সিম্পল','#4338ca','topbar','#ffffff',accent=>[
    {...newLine(0,0),w:CW,h:10,color:accent},
    newText('ASSIGNMENT',90,90,26,true,600),
    newText('Course Title: ',90,190,16),
    newText('Course Code: ',90,225,16),
    {...newLine(90,265),w:400,h:2,color:accent},
    newText('Topic:',90,320,20,true,600),
    newText('Prepared by:',110,560,16,true),
    newText('Name: ',130,595,15),
    newText('ID / Roll: ',130,625,15),
    newText('Section: ',130,655,15),
    newText('Submitted to:',450,560,16,true),
    newText('Name: ',470,595,15),
    newText('Submission Date: ',110,1000,15)
  ]),
  tpl('assignment-bold','Assignment — Bold','অ্যাসাইনমেন্ট — বোল্ড','#c2410c','box','#ffffff',accent=>[
    {...newLine(70,70),w:654,h:110,color:accent},
    newText('ASSIGNMENT',100,92,30,true,600,"'Inter',sans-serif"),
    newText('Course: ',100,225,16),
    newText('Topic:',90,340,20,true,600),
    newText('Prepared by:',110,580,16,true),
    newText('Name: ',130,615,15),
    newText('ID / Roll: ',130,645,15),
    newText('Submitted to:',450,580,16,true),
    newText('Name: ',470,615,15),
    newText('Date: ',110,1010,15)
  ]),
  tpl('lab-technical','Lab Report — Technical','ল্যাব রিপোর্ট — টেকনিক্যাল','#334155','sidebar','#ffffff',accent=>[
    {...newLine(0,0),w:16,h:CH,color:accent},
    newText('LABORATORY REPORT',70,80,26,true,600),
    newText('Experiment No: ',70,180,16),
    newText('Experiment Name:',70,220,18,true,500),
    newText('Course: ',70,320,16),
    newText('Group / Team: ',70,355,16),
    newText('Submitted by:',90,560,16,true),
    newText('Name: ',110,595,15),
    newText('ID: ',110,625,15),
    newText('Partners: ',110,655,15),
    newText('Instructor: ',450,560,16,true),
    newText('Date Performed: ',90,980,15),
    newText('Date Submitted: ',90,1010,15)
  ]),
  tpl('lab-classic','Lab Report — Classic','ল্যাব রিপোর্ট — ক্লাসিক','#0369a1','topbar','#ffffff',accent=>[
    {...newLine(0,0),w:CW,h:10,color:accent},
    newText('LABORATORY REPORT',90,90,26,true,600,"'Lora',serif"),
    newText('Experiment Title:',90,210,20,true,600,"'Lora',serif"),
    {...newLine(90,270),w:450,h:2,color:accent},
    newText('Course Title: ',90,320,16),
    newText('Course Code: ',90,355,16),
    newText('Submitted by:',110,600,16,true),
    newText('Name: ',130,635,15),
    newText('ID: ',130,665,15),
    newText('Submitted to:',450,600,16,true),
    newText('Name: ',470,635,15),
    newText('Date Performed: ',110,1010,14),
    newText('Date Submitted: ',110,1040,14)
  ]),
  tpl('project-report','Project Report','প্রজেক্ট রিপোর্ট','#a9782f','topbar','#ffffff',accent=>[
    {...newLine(0,0),w:CW,h:8,color:accent},
    newText('PROJECT REPORT',90,90,26,true,600,"'Lora',serif"),
    newText('Project Title Goes Here',90,300,24,true,600,"'Lora',serif"),
    {...newLine(90,370),w:500,h:2,color:accent},
    newText('Submitted by:',110,600,16,true),
    newText('Name: ',130,635,15),
    newText('ID: ',130,665,15),
    newText('Supervised by:',450,600,16,true),
    newText('Name: ',470,635,15),
    newText('Designation: ',470,665,15),
    newText('Date: ',110,1030,15)
  ]),
  tpl('internship-report','Internship Report','ইন্টার্নশিপ রিপোর্ট','#0d9488','sidebar','#ffffff',accent=>[
    {...newLine(0,0),w:16,h:CH,color:accent},
    newText('INTERNSHIP REPORT',64,80,26,true,600),
    newText('Organization Name: ',64,180,16),
    newText('Duration: ',64,215,16),
    newText('Prepared by:',84,600,16,true),
    newText('Name: ',104,635,15),
    newText('ID: ',104,665,15),
    newText('Supervisor:',460,600,16,true),
    newText('Name: ',480,635,15),
    newText('Date: ',64,1040,15)
  ]),
  tpl('group-assignment','Group Assignment','গ্রুপ অ্যাসাইনমেন্ট','#7c3aed','box','#ffffff',accent=>[
    {...newLine(70,60),w:654,h:8,color:accent},
    newText('GROUP ASSIGNMENT',90,90,26,true,600),
    newText('Topic:',90,220,20,true,600),
    newText('Group No: ',90,280,16),
    newText('Group Members:',110,520,16,true),
    newText('1. Name -  ID',130,555,15),
    newText('2. Name -  ID',130,585,15),
    newText('3. Name -  ID',130,615,15),
    newText('4. Name -  ID',130,645,15),
    newText('Submitted to: ',110,1000,15)
  ]),
  tpl('research-paper','Research Paper — Academic','রিসার্চ পেপার — একাডেমিক','#7f1d1d','minimal','#ffffff',accent=>[
    newText('Research Paper Title',80,340,26,true,600,'Georgia,serif'),
    {...newLine(80,410),w:300,h:2,color:accent},
    newText('Author Name',80,460,16,false,600,'Georgia,serif'),
    newText('Affiliation / Institution',80,495,14,false,600,'Georgia,serif'),
    newText('Abstract',80,700,15,true,600,'Georgia,serif'),
    newText('Keywords: ',80,900,13,false,600,'Georgia,serif'),
    newText('Date: ',80,1030,13,false,400,'Georgia,serif')
  ]),
  tpl('seminar-cover','Seminar / Presentation','সেমিনার / প্রেজেন্টেশন','#be123c','center','#ffffff',accent=>[
    newText('SEMINAR PRESENTATION',150,380,22,true,500),
    newText('Presentation Title Goes Here',110,440,28,true,580),
    {...newLine(247,510),w:300,h:4,color:accent},
    newText('Presented by:',290,640,16,true),
    newText('Name: ',290,675,15),
    newText('Course: ',290,705,15),
    newText('Date: ',290,1020,15)
  ]),
  tpl('term-paper','Term Paper','টার্ম পেপার','#166534','topbar','#ffffff',accent=>[
    {...newLine(0,0),w:CW,h:10,color:accent},
    newText('TERM PAPER',90,90,26,true,600,"'Lora',serif"),
    newText('Course Title: ',90,190,16),
    newText('Topic:',90,300,20,true,600,"'Lora',serif"),
    newText('Submitted by:',110,580,16,true),
    newText('Name: ',130,615,15),
    newText('ID: ',130,645,15),
    newText('Submitted to:',450,580,16,true),
    newText('Name: ',470,615,15),
    newText('Date: ',110,1030,15)
  ]),
  tpl('case-study','Case Study — Minimal','কেস স্টাডি — মিনিমাল','#1f2937','minimal','#ffffff',accent=>[
    newText('CASE STUDY',90,360,22,true,500),
    newText('Study Title Goes Here',90,410,26,true,600),
    {...newLine(90,470),w:260,h:3,color:accent},
    newText('Prepared by:',110,650,16,true),
    newText('Name: ',130,685,15),
    newText('ID: ',130,715,15),
    newText('Course: ',450,650,15),
    newText('Date: ',110,1040,15)
  ])
];

// Shared core: given a source image and a way to build the list of
// reference "background" colors, computes a soft alpha matte by color
// distance to the nearest reference, decontaminates edge pixels, and
// returns a cutout PNG. Used by both the automatic border-sampled
// removeBg() and the manual customRemoveBg() (pick-a-color) tool below,
// so any future fix to the matting/decontamination logic benefits both.
function applyBgRemoval(src,buildRefs,loT,hiT,cb){
  const img=new Image();
  img.onload=()=>{
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const d=ctx.getImageData(0,0,c.width,c.height);const p=d.data;
    const w=c.width,ht=c.height;
    const refs=buildRefs(w,ht,p);
    if(!refs||!refs.length){ cb(src); return; }

    // Distance from every pixel to its nearest reference bg color, and the
    // color of that nearest reference (used later to strip background
    // bleed out of anti-aliased edge pixels).
    const dist=new Float32Array(w*ht);
    const nrR=new Float32Array(w*ht),nrG=new Float32Array(w*ht),nrB=new Float32Array(w*ht);
    for(let i=0;i<w*ht;i++){
      const pi=i*4;
      const r=p[pi],g=p[pi+1],b=p[pi+2];
      let best=Infinity,br=0,bg=0,bb=0;
      for(let k=0;k<refs.length;k++){
        const rr=refs[k];
        const dd=(rr[0]-r)**2+(rr[1]-g)**2+(rr[2]-b)**2;
        if(dd<best){best=dd;br=rr[0];bg=rr[1];bb=rr[2];}
      }
      dist[i]=Math.sqrt(best);
      nrR[i]=br;nrG[i]=bg;nrB[i]=bb;
    }

    // Classify by color distance alone (no border-connectivity requirement).
    // Using pure flood-fill from the border used to mean a background-colored
    // pocket fully enclosed by foreground shapes (e.g. a narrow gap between
    // two adjacent flame colors that never touches the outer edge) was left
    // untouched/opaque. Classifying every pixel purely by color removes that
    // blind spot, so enclosed gaps clear along with the outer background.
    const smooth=t=>t*t*(3-2*t);
    let alpha=new Float32Array(w*ht);
    let bgLike=0;
    for(let i=0;i<w*ht;i++){
      let t=(dist[i]-loT)/(hiT-loT);
      if(t<0)t=0; else if(t>1)t=1;
      alpha[i]=smooth(t);
      if(alpha[i]<0.5) bgLike++;
    }
    // Safety net: only bail if virtually the entire image reads as
    // background - a genuinely large plain background around a small logo
    // is legitimate and should NOT be blocked.
    if(bgLike>w*ht*0.985){ cb(src); return; }

    // light blur to smooth pixel-level jaggedness on the cut edge
    const blur=srcArr=>{
      const out=new Float32Array(w*ht);
      for(let y=0;y<ht;y++)for(let x=0;x<w;x++){
        let sum=0,n=0;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          const nx=x+dx,ny=y+dy;
          if(nx>=0&&nx<w&&ny>=0&&ny<ht){sum+=srcArr[ny*w+nx];n++;}
        }
        out[y*w+x]=sum/n;
      }
      return out;
    };
    alpha=blur(alpha);

    // Posterize the extremes back to solid 0 / 1 after the blur, so a thin
    // leftover-color ring can't survive the smoothing pass - only a narrow
    // true antialiased edge keeps an in-between value.
    for(let i=0;i<w*ht;i++){
      if(alpha[i]<0.15) alpha[i]=0;
      else if(alpha[i]>0.88) alpha[i]=1;
    }

    // Decontaminate: a fractional-alpha edge pixel still holds its original
    // RGB, which is a blend with the background color.
    //
    // For most icon-colored edges we don't know the true foreground color,
    // so we fall back to a generic distance-based estimate. But white and
    // black are by far the most common text/ink colors laid over a flat
    // background, and for THOSE we can solve exactly: check whether the
    // pixel lies almost perfectly on the straight line between the
    // background color and pure white (or pure black). If it does, it's a
    // clean two-color blend and we can recover the true alpha and output
    // the exact known color - no guessing, so no leftover background tint.
    const tryLine=(origR,origG,origB,bgR,bgG,bgB,cr,cg,cbv)=>{
      const lr=cr-bgR,lg=cg-bgG,lb=cbv-bgB;
      const lenSq=lr*lr+lg*lg+lb*lb;
      if(lenSq<1) return null;
      const dr=origR-bgR,dg=origG-bgG,db=origB-bgB;
      const proj=(dr*lr+dg*lg+db*lb)/lenSq;
      const px=bgR+proj*lr,py=bgG+proj*lg,pz=bgB+proj*lb;
      const perp=Math.sqrt((origR-px)**2+(origG-py)**2+(origB-pz)**2);
      return {proj,perp};
    };
    for(let i=0;i<w*ht;i++){
      const a=alpha[i];
      const pi=i*4;
      if(a<=0){
        p[pi]=0;p[pi+1]=0;p[pi+2]=0;p[pi+3]=0;
        continue;
      }
      if(a>0&&a<1){
        const r=p[pi],g=p[pi+1],b=p[pi+2];
        const bgR=nrR[i],bgG=nrG[i],bgB=nrB[i];
        const white=tryLine(r,g,b,bgR,bgG,bgB,255,255,255);
        const black=tryLine(r,g,b,bgR,bgG,bgB,0,0,0);
        const lineT=22;
        let best=null;
        if(white&&white.perp<lineT) best={c:[255,255,255],proj:white.proj,perp:white.perp};
        if(black&&black.perp<lineT&&(!best||black.perp<best.perp)) best={c:[0,0,0],proj:black.proj,perp:black.perp};
        if(best){
          const pa=Math.max(0,Math.min(1,best.proj));
          p[pi]=best.c[0];p[pi+1]=best.c[1];p[pi+2]=best.c[2];
          p[pi+3]=Math.round(pa*255);
          continue;
        }
        const aEff=Math.max(a,0.3);
        p[pi]  =Math.max(0,Math.min(255,Math.round((r-(1-a)*bgR)/aEff)));
        p[pi+1]=Math.max(0,Math.min(255,Math.round((g-(1-a)*bgG)/aEff)));
        p[pi+2]=Math.max(0,Math.min(255,Math.round((b-(1-a)*bgB)/aEff)));
      }
      p[pi+3]=Math.round(a*255);
    }
    ctx.putImageData(d,0,0);
    cb(c.toDataURL('image/png'));
  };
  img.src=src;
}

function removeBg(src,cb){
  applyBgRemoval(src,(w,ht,p)=>{
    // Collect a set of reference background colors by sampling a border
    // BAND a few pixels thick (not just the outermost single-pixel line),
    // so subtle gradient / compression noise in the background is captured
    // too, deduping close ones.
    const idxOf=(x,y)=>y*w+x;
    const refs=[];
    const bandPx=Math.max(2,Math.round(Math.min(w,ht)*0.01));
    const step=Math.max(1,Math.floor(Math.min(w,ht)/120));
    const addRef=(x,y)=>{
      const pi=idxOf(x,y)*4;
      const r=p[pi],g=p[pi+1],b=p[pi+2];
      for(let i=0;i<refs.length;i++){
        const rr=refs[i];
        if(Math.sqrt((rr[0]-r)**2+(rr[1]-g)**2+(rr[2]-b)**2)<18) return;
      }
      refs.push([r,g,b]);
    };
    for(let bd=0;bd<bandPx;bd++){
      for(let x=0;x<w;x+=step){addRef(x,bd);addRef(x,ht-1-bd);}
      for(let y=0;y<ht;y+=step){addRef(bd,y);addRef(w-1-bd,y);}
    }
    return refs;
  },14,48,cb);
}

// Manual/custom removal: the person picks (or types) one exact color and a
// tolerance, and every pixel close to that color - anywhere in the image,
// not just the border - is cleared. This is what fixes leftover tint that
// survives the automatic pass around thin, near-background-colored shapes
// like light text on a similar-hue backdrop: the person can zero in on the
// exact leftover color and widen the tolerance until it's gone.
function customRemoveBg(src,hex,tolerance,cb){
  const h2=hex.replace('#','');
  const r=parseInt(h2.slice(0,2),16),g=parseInt(h2.slice(2,4),16),b=parseInt(h2.slice(4,6),16);
  const t=Math.max(0,Math.min(100,tolerance));
  const loT=2+t*0.5;
  const hiT=loT+16+t*0.6;
  applyBgRemoval(src,()=>[[r,g,b]],loT,hiT,cb);
}

// Manual, hands-on erase/restore brush. Opens the current image (and its
// original, for the restore brush) in a full-screen editor where the person
// drags to clear or bring back pixels themselves, corner by corner, instead
// of relying on any automatic detection.
function openManualEraser(src,origSrc,onApply){
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;';
  const bar=document.createElement('div');
  bar.style.cssText='display:flex;gap:8px;align-items:center;color:#fff;font:13px Inter,sans-serif;flex-wrap:wrap;justify-content:center;max-width:92vw;';
  const mkBtn=(txt)=>{const b=document.createElement('button');b.type='button';b.textContent=txt;b.style.cssText='background:#33407a;color:#fff;border:none;border-radius:8px;padding:7px 14px;font-size:13px;cursor:pointer;';return b;};
  const modeErase=mkBtn('🧽 Erase');
  const modeRestore=mkBtn('↩ Restore');
  const sizeLbl=document.createElement('span');sizeLbl.textContent='Brush size';
  const sizeInput=document.createElement('input');sizeInput.type='range';sizeInput.min='3';sizeInput.max='100';sizeInput.value='18';sizeInput.style.width='140px';
  const resetBtn=mkBtn('Reset');
  const cancelBtn=mkBtn('Cancel');cancelBtn.style.background='transparent';cancelBtn.style.border='1px solid #fff';
  const doneBtn=mkBtn('✓ Done');
  bar.append(modeErase,modeRestore,sizeLbl,sizeInput,resetBtn,cancelBtn,doneBtn);
  const hint=document.createElement('div');
  hint.textContent='Drag over the image to erase or restore that spot. Esc to cancel.';
  hint.style.cssText='color:#ccc;font:12px Inter,sans-serif;';
  const wrap=document.createElement('div');
  wrap.style.cssText='position:relative;max-width:92vw;max-height:72vh;';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='max-width:92vw;max-height:72vh;display:block;touch-action:none;cursor:none;background:repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%) 50%/16px 16px;box-shadow:0 8px 30px rgba(0,0,0,.5);';
  const cursorDot=document.createElement('div');
  cursorDot.style.cssText='position:absolute;border:2px solid #fff;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:difference;display:none;';
  wrap.append(canvas,cursorDot);
  overlay.append(bar,wrap,hint);
  document.body.appendChild(overlay);

  let mode='erase';
  const setMode=m=>{mode=m;modeErase.style.opacity=m==='erase'?1:.5;modeRestore.style.opacity=m==='restore'?1:.5;};
  setMode('erase');
  modeErase.onclick=()=>setMode('erase');
  modeRestore.onclick=()=>setMode('restore');

  const cleanup=()=>{document.body.removeChild(overlay);document.removeEventListener('keydown',onKey);};
  const onKey=e=>{if(e.key==='Escape')cleanup();};
  document.addEventListener('keydown',onKey);
  cancelBtn.onclick=cleanup;

  const img=new Image(),origImg=new Image();
  let ready=0;
  const start=()=>{
    ready++; if(ready<2) return;
    canvas.width=img.width;canvas.height=img.height;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    const origCanvas=document.createElement('canvas');
    origCanvas.width=img.width;origCanvas.height=img.height;
    origCanvas.getContext('2d').drawImage(origImg,0,0,img.width,img.height);

    resetBtn.onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);};
    doneBtn.onclick=()=>{const out=canvas.toDataURL('image/png');cleanup();onApply(out);};

    const ptToCanvas=e=>{
      const rect=canvas.getBoundingClientRect();
      return {x:(e.clientX-rect.left)/rect.width*canvas.width,y:(e.clientY-rect.top)/rect.height*canvas.height};
    };
    const paintAt=(x,y)=>{
      const r=+sizeInput.value;
      ctx.save();
      if(mode==='erase'){
        ctx.globalCompositeOperation='destination-out';
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      }else{
        // clip() restricts every following draw call (including clearRect
        // and drawImage) to the circle, so this only repaints that one spot
        // from the original image - everything outside it is untouched.
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(origCanvas,0,0);
      }
      ctx.restore();
    };
    let drawing=false;
    canvas.onpointerdown=e=>{drawing=true;const{x,y}=ptToCanvas(e);paintAt(x,y);canvas.setPointerCapture(e.pointerId);};
    canvas.onpointermove=e=>{
      const rect=canvas.getBoundingClientRect();
      cursorDot.style.display='block';
      cursorDot.style.left=(e.clientX-rect.left)+'px';
      cursorDot.style.top=(e.clientY-rect.top)+'px';
      const dScreen=(+sizeInput.value)*2*(rect.width/canvas.width);
      cursorDot.style.width=cursorDot.style.height=dScreen+'px';
      if(!drawing) return;
      const{x,y}=ptToCanvas(e);paintAt(x,y);
    };
    const stop=()=>drawing=false;
    canvas.onpointerup=stop;canvas.onpointercancel=stop;
    canvas.onpointerleave=()=>{stop();cursorDot.style.display='none';};
  };
  img.onload=start;origImg.onload=start;
  img.src=src;origImg.src=origSrc||src;
}

// Lets the person click directly on a pixel of the image to sample its
// exact color, so they don't have to guess a hex value for the leftover
// tint they're seeing.
function pickColorFromImage(src,cb){
  const overlay=document.createElement('div');
  const msg=document.createElement('div');
  msg.textContent='Click the leftover color to sample it (Esc to cancel)';
  msg.style.cssText='color:#fff;font:14px Inter,sans-serif;';
  const canvas=document.createElement('canvas');
  canvas.style.cssText='max-width:90vw;max-height:78vh;cursor:crosshair;box-shadow:0 8px 30px rgba(0,0,0,.5);image-rendering:pixelated;background:repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%) 50%/16px 16px;';
  const cancelBtn=document.createElement('button');
  cancelBtn.textContent='Cancel';
  cancelBtn.style.cssText='background:transparent;border:1px solid #fff;color:#fff;border-radius:8px;padding:6px 14px;font-size:13px;cursor:pointer;';
  overlay.appendChild(msg);overlay.appendChild(canvas);overlay.appendChild(cancelBtn);
  document.body.appendChild(overlay);
  const cleanup=()=>{
    document.body.removeChild(overlay);
    document.removeEventListener('keydown',onKey);
  };
  const onKey=e=>{ if(e.key==='Escape') cleanup(); };
  document.addEventListener('keydown',onKey);
  cancelBtn.onclick=cleanup;
  const img=new Image();
  img.onload=()=>{
    canvas.width=img.width;canvas.height=img.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
    canvas.onclick=e=>{
      const rect=canvas.getBoundingClientRect();
      const x=Math.max(0,Math.min(canvas.width-1,Math.floor((e.clientX-rect.left)/rect.width*canvas.width)));
      const y=Math.max(0,Math.min(canvas.height-1,Math.floor((e.clientY-rect.top)/rect.height*canvas.height)));
      const d=ctx.getImageData(x,y,1,1).data;
      const hex='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
      cleanup();
      cb(hex);
    };
  };
  img.src=src;
}



function sharpenImg(src,cb){
  const img=new Image();
  img.onload=()=>{
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const d=ctx.getImageData(0,0,c.width,c.height);const p=d.data;
    const orig=new Uint8ClampedArray(p);
    const w=c.width,ht=c.height;
    const amt=0.7; // unsharp-mask strength
    const k=[0,-amt,0, -amt,1+4*amt,-amt, 0,-amt,0];
    for(let y=1;y<ht-1;y++){
      for(let x=1;x<w-1;x++){
        for(let ch=0;ch<3;ch++){
          let sum=0,ki=0;
          for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
            sum+=orig[((y+dy)*w+(x+dx))*4+ch]*k[ki++];
          }
          p[(y*w+x)*4+ch]=sum<0?0:sum>255?255:sum;
        }
      }
    }
    ctx.putImageData(d,0,0);
    cb(c.toDataURL('image/png'));
  };
  img.src=src;
}

function loadDraft(){
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(!raw) return null;
    const d=JSON.parse(raw);
    if(!d||!Array.isArray(d.els)||!d.els.length) return null;
    uid=Math.max(...d.els.map(e=>e.id),0)+1;
    return d;
  }catch(err){return null;}
}

function App(){
  const draft=useRef(loadDraft());
  const [lang,setLang]=useState((draft.current&&draft.current.lang)||'en');
  const T=LANGS[lang];
  const [els,setEls]=useState((draft.current&&draft.current.els)||defaultEls());
  const [bg,setBg]=useState((draft.current&&draft.current.bg)||'#ffffff');
  const [sel,setSel]=useState(null);
  const [multi,setMulti]=useState(()=>new Set());
  const [busy,setBusy]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [guides,setGuides]=useState({v:false,h:false});
  const [toast,setToast]=useState('');
  const [confirmDlg,setConfirmDlg]=useState(null);
  const askConfirm=(message,onYes)=>setConfirmDlg({message,onYes});
  const [history,setHistory]=useState([]);
  const [redoStack,setRedoStack]=useState([]);
  const [customColor,setCustomColor]=useState('#008080');
  const [customTol,setCustomTol]=useState(30);
  const canvasRef=useRef(null);
  const drag=useRef(null);
  const resize=useRef(null);
  const toastTimer=useRef(null);
  const saveTimer=useRef(null);
  const ZOOMS=[0.4,0.5,0.65,0.75,0.9,1,1.15,1.3,1.5];

  useEffect(()=>{
    const fitZoom=()=>{
      const avail=window.innerWidth-32;
      if(avail<CW){
        setZoom(Math.max(ZOOMS[0],Math.min(1,Math.round((avail/CW)*100)/100)));
      }
    };
    fitZoom();
    window.addEventListener('resize',fitZoom);
    return()=>window.removeEventListener('resize',fitZoom);
  },[]);

  const showToast=useCallback(msg=>{
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(''),1600);
  },[]);

  useEffect(()=>{
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{
      try{
        localStorage.setItem(STORE_KEY,JSON.stringify({els,lang,bg}));
        showToast(T.saved);
      }catch(err){}
    },700);
    return()=>clearTimeout(saveTimer.current);
    // eslint-disable-next-line
  },[els,lang,bg]);

  const pushHistory=snapshot=>{
    setHistory(h=>[...h.slice(-24),snapshot]);
    setRedoStack([]);
  };
  const undo=()=>{
    setHistory(h=>{
      if(!h.length) return h;
      setRedoStack(r=>[els,...r].slice(0,25));
      setEls(h[h.length-1]);
      setSel(null);
      return h.slice(0,-1);
    });
  };
  const redo=()=>{
    setRedoStack(r=>{
      if(!r.length) return r;
      setHistory(h=>[...h,els].slice(-25));
      setEls(r[0]);
      return r.slice(1);
    });
  };

  const update=(id,patch)=>setEls(p=>p.map(e=>e.id===id?{...e,...patch}:e));
  const del=id=>{pushHistory(els);setEls(p=>p.filter(e=>e.id!==id));setSel(null);setMulti(new Set());};
  const delMulti=()=>{
    if(!multi.size) return;
    pushHistory(els);
    setEls(p=>p.filter(e=>!multi.has(e.id)));
    setMulti(new Set());
    setSel(null);
  };
  const dup=id=>{pushHistory(els);setEls(p=>{const src=p.find(e=>e.id===id);if(!src)return p;const ne={...src,id:uid++,z:uid,x:src.x+20,y:src.y+20};setSel(ne.id);return[...p,ne];});};
  const front=id=>{pushHistory(els);update(id,{z:uid++});};
  const addEl=fn=>{pushHistory(els);const ne=fn(220,220);setEls(p=>[...p,ne]);setSel(ne.id);};

  const startDrag=(e,el)=>{
    e.stopPropagation();
    if(e.shiftKey||e.ctrlKey||e.metaKey){
      setMulti(m=>{
        const n=new Set(m);
        if(n.size===0&&sel!=null&&sel!==el.id) n.add(sel);
        if(n.has(el.id)) n.delete(el.id); else n.add(el.id);
        return n;
      });
      setSel(el.id);
      return;
    }
    setMulti(new Set());
    setSel(el.id);pushHistory(els);
    const r=canvasRef.current.getBoundingClientRect();
    drag.current={id:el.id,w:el.w,h:el.h,offX:(e.clientX-r.left)/zoom-el.x,offY:(e.clientY-r.top)/zoom-el.y};
    window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);
  };
  const onMove=e=>{
    if(drag.current){
      const r=canvasRef.current.getBoundingClientRect();
      const d=drag.current;
      let nx=(e.clientX-r.left)/zoom-d.offX;
      let ny=(e.clientY-r.top)/zoom-d.offY;
      let vg=false,hg=false;
      const cx=(CW-d.w)/2, cy=(CH-d.h)/2;
      if(Math.abs(nx-cx)<7){nx=cx;vg=true;} else nx=Math.round(nx/8)*8;
      if(Math.abs(ny-cy)<7){ny=cy;hg=true;} else ny=Math.round(ny/8)*8;
      nx=Math.max(0,Math.min(CW-4,nx));ny=Math.max(0,Math.min(CH-4,ny));
      setGuides({v:vg,h:hg});
      update(d.id,{x:nx,y:ny});
    } else if(resize.current){
      const r=canvasRef.current.getBoundingClientRect();
      const el=resize.current;
      const nw=Math.max(24,Math.round(((e.clientX-r.left)/zoom-el.x)/4)*4);
      const nh=Math.max(16,Math.round(((e.clientY-r.top)/zoom-el.y)/4)*4);
      update(el.id,{w:nw,h:nh});
    }
  };
  const onUp=()=>{drag.current=null;resize.current=null;setGuides({v:false,h:false});window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);};
  const startResize=(e,el)=>{e.stopPropagation();setSel(el.id);pushHistory(els);resize.current=el;window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);};

  useEffect(()=>{
    const onKey=e=>{
      const tag=(document.activeElement&&document.activeElement.tagName)||'';
      const typing=tag==='INPUT'||tag==='TEXTAREA';
      const mod=e.ctrlKey||e.metaKey;
      if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}
      if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();redo();return;}
      if(typing) return;
      if(mod&&e.key.toLowerCase()==='d'&&sel){e.preventDefault();dup(sel);return;}
      if((e.key==='Delete'||e.key==='Backspace')&&(multi.size||sel)){e.preventDefault();multi.size?delMulti():del(sel);return;}
      if(e.key==='Escape'){setSel(null);setMulti(new Set());return;}
      if(sel&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
        e.preventDefault();
        const step=e.shiftKey?10:2;
        const cur=els.find(x=>x.id===sel);if(!cur)return;
        const dx=e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0;
        const dy=e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0;
        update(sel,{x:cur.x+dx,y:cur.y+dy});
      }
    };
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
    // eslint-disable-next-line
  },[sel,multi,els,history,redoStack]);

  const handleLogo=(file)=>{
    pushHistory(els);
    const reader=new FileReader();
    reader.onload=()=>{
      const orig=reader.result;
      const id=uid++;
      setEls(p=>[...p,{id,z:uid,type:'image',x:320,y:50,w:150,h:150,src:orig,orig}]);
      setSel(id);
      setBusy(true);
      removeBg(orig,out=>{update(id,{src:out});setBusy(false);});
    };
    reader.readAsDataURL(file);
  };

  const [showGallery,setShowGallery]=useState(false);
  const useTemplate=(id)=>{
    const t=TEMPLATES.find(x=>x.id===id);
    if(!t) return;
    askConfirm(T.confirmTemplate||T.confirmNew,()=>{
      pushHistory(els);
      setEls(t.build(t.accent));
      setBg(t.bg);
      setSel(null);
      setShowGallery(false);
    });
  };

  const zoomIn=()=>setZoom(z=>{const i=ZOOMS.findIndex(v=>v>z+0.001);return i===-1?z:ZOOMS[i];});
  const zoomOut=()=>setZoom(z=>{const arr=[...ZOOMS].reverse();const i=arr.findIndex(v=>v<z-0.001);return i===-1?z:arr[i];});
  const zoomReset=()=>setZoom(1);

  const newProject=()=>{
    askConfirm(T.confirmNew,()=>{
      pushHistory(els);
      setEls(defaultEls());
      setSel(null);
      setBg('#ffffff');
    });
  };

  const dl=async(fmt)=>{
    setSel(null);setBusy(true);
    try{
      await new Promise(r=>setTimeout(r,60));
      if(typeof html2canvas!=='function') throw new Error('html2canvas failed to load');
      const canvas=await html2canvas(canvasRef.current,{scale:2,useCORS:true,width:CW,height:CH});
      let blob,filename;
      if(fmt==='png'){
        blob=await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('PNG export failed')),'image/png'));
        filename='cover.png';
      } else {
        const pdf=new jsPDF({unit:'px',format:[CW,CH]});
        pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,CW,CH);
        blob=pdf.output('blob');filename='cover.pdf';
      }
      let saved=false;
      try{
        if(window.claude&&window.claude.use){
          const d=await window.claude.use('downloads');
          if(d){
            const fr=new FileReader();
            const dataUrl=await new Promise((res,rej)=>{fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(blob);});
            await d.save({filename,data:dataUrl});
            saved=true;
          }
        }
      }catch(err){}
      if(!saved){
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url;a.download=filename;
        document.body.appendChild(a);a.click();document.body.removeChild(a);
        setTimeout(()=>URL.revokeObjectURL(url),4000);
      }
      showToast(fmt==='pdf'?'PDF '+(T.saved||'ready'):'PNG '+(T.saved||'ready'));
    }catch(err){
      console.error('Download failed:',err);
      showToast('Download failed - '+(err&&err.message?err.message:'try again'));
    }finally{
      setBusy(false);
    }
  };

  const selEl=els.find(e=>e.id===sel);
  const sorted=[...els].sort((a,b)=>a.z-b.z);

  const renderInner=el=>{
    if(el.type==='text') return h('div',{style:{width:'100%',height:'100%',fontSize:el.fontSize,fontWeight:el.bold?700:400,fontStyle:el.italic?'italic':'normal',textDecoration:el.underline?'underline':'none',textAlign:el.align,color:el.color,padding:4,whiteSpace:'pre-wrap',overflow:'hidden',lineHeight:1.35,fontFamily:el.fontFamily}},el.text);
    if(el.type==='shape') return h('div',{style:{width:'100%',height:'100%',border:el.border+'px solid '+el.color,borderRadius:el.radius}});
    if(el.type==='line') return h('div',{style:{width:'100%',height:'100%',background:el.color}});
    if(el.type==='image') return h('img',{src:el.src,draggable:false,style:{width:'100%',height:'100%',objectFit:'contain'}});
  };
  // Small mock preview drawn per template card in the gallery - not the
  // real template content (that would need a full render pass per card),
  // just enough visual shape (accent bar position + placeholder lines) for
  // the person to browse by look, the way a real template gallery works.
  const renderTplPreview=t=>{
    const parts=[];
    if(t.layout==='topbar') parts.push(h('div',{key:'a',style:{position:'absolute',top:0,left:0,right:0,height:'9%',background:t.accent}}));
    if(t.layout==='sidebar') parts.push(h('div',{key:'a',style:{position:'absolute',top:0,left:0,bottom:0,width:'7%',background:t.accent}}));
    if(t.layout==='box') parts.push(h('div',{key:'a',style:{position:'absolute',top:'8%',left:'10%',right:'10%',height:'16%',background:t.accent,borderRadius:2}}));
    if(t.layout==='center') parts.push(h('div',{key:'a',style:{position:'absolute',top:'44%',left:'30%',width:'40%',height:'2.5%',background:t.accent}}));
    if(t.layout==='minimal') parts.push(h('div',{key:'a',style:{position:'absolute',top:'38%',left:'12%',width:'28%',height:'2%',background:t.accent}}));
    const left=t.layout==='sidebar'?'15%':'10%';
    [[0.28,'62%',8,'#333'],[0.53,'40%',3,'#ccc'],[0.6,'40%',3,'#ccc'],[0.82,'40%',3,'#ccc'],[0.88,'40%',3,'#ccc']].forEach((r,i)=>{
      parts.push(h('div',{key:'l'+i,style:{position:'absolute',top:(r[0]*100)+'%',left,width:r[1],height:r[2]+'%',background:r[3],borderRadius:1}}));
    });
    return h('div',{style:{position:'relative',width:'100%',paddingTop:(CH/CW*100)+'%',background:'#fff',border:'1px solid var(--border)',borderRadius:4,overflow:'hidden'}},parts);
  };

  const renderEl=el=>h('div',{key:el.id,className:'field-box'+(sel===el.id||multi.has(el.id)?' selected':''),style:{left:el.x,top:el.y,width:el.w,height:el.h,zIndex:el.z},onPointerDown:e=>startDrag(e,el)},
    renderInner(el),
    sel===el.id?h('div',{className:'handle',onPointerDown:e=>startResize(e,el)}):null
  );

  return h('div',null,
    h('div',{className:'topbar'},
      h('div',{className:'brand'},h('span',{className:'seal'}),T.brand),
      h('button',{className:'btn-o',type:'button',onClick:()=>addEl((x,y)=>newText(T.text,x,y))},'+ '+T.addText),
      h('button',{className:'btn-o',type:'button',onClick:()=>addEl(newShape)},'+ '+T.addBox),
      h('button',{className:'btn-o',type:'button',onClick:()=>addEl(newLine)},'+ '+T.addLine),
      h('label',{className:'btn-o',style:{cursor:'pointer'}},'+ '+T.addLogo,
        h('input',{type:'file',accept:'image/*',style:{display:'none'},onChange:e=>{if(e.target.files[0]){handleLogo(e.target.files[0]);e.target.value='';}}})),
      h('button',{className:'btn-o',type:'button',onClick:()=>setShowGallery(true)},'🖼 '+T.preset),
      multi.size>0?h('button',{className:'btn danger',type:'button',onClick:delMulti},'🗑 Delete ('+multi.size+')'):null,
      h('div',{className:'divider'}),
      h('button',{className:'btn-o icn',type:'button',title:T.undo,disabled:!history.length,onClick:undo},'↶'),
      h('button',{className:'btn-o icn',type:'button',title:T.redo,disabled:!redoStack.length,onClick:redo},'↷'),
      h('div',{className:'divider'}),
      h('div',{className:'zoomwrap'},
        h('button',{className:'btn-o icn',type:'button',onClick:zoomOut},'−'),
        h('span',{onClick:zoomReset,style:{cursor:'pointer'}},Math.round(zoom*100)+'%'),
        h('button',{className:'btn-o icn',type:'button',onClick:zoomIn},'+')
      ),
      h('div',{style:{flex:1}}),
      h('button',{className:'btn-o',type:'button',onClick:newProject},T.newProj),
      h('select',{className:'ctl',value:lang,onChange:e=>setLang(e.target.value)},
        Object.keys(LANGS).map(k=>h('option',{key:k,value:k},LANGS[k].name))),
      h('button',{className:'btn gold',type:'button',disabled:busy,onClick:()=>dl('pdf')},busy?T.removing:('⬇ '+T.pdf)),
      h('button',{className:'btn-o',type:'button',disabled:busy,onClick:()=>dl('png')},T.png)
    ),
    h('div',{className:'body'},
      h('div',{className:'stage'},
        h('div',{id:'canvasWrap',style:{width:CW*zoom,height:CH*zoom}},
          h('div',{id:'canvas',ref:canvasRef,style:{width:CW,height:CH,transform:'scale('+zoom+')',background:bg},onPointerDown:()=>{setSel(null);setMulti(new Set());}},
            sorted.map(renderEl),
            guides.v?h('div',{className:'guide',style:{left:CW/2,top:0,width:1,height:CH}}):null,
            guides.h?h('div',{className:'guide',style:{top:CH/2,left:0,height:1,width:CW}}):null
          )
        )
      ),
      h('div',{className:'inspector'},
        !selEl?h('div',null,
          h('p',{className:'emptytip'},T.select),
          h('label',{className:'lbl'},T.bg),
          h('input',{type:'color',value:bg,onChange:e=>setBg(e.target.value)}),
          h('div',{className:'hint'},
            h('div',null,h('span',{className:'kbd'},'Ctrl+Z'),' / ',h('span',{className:'kbd'},'Ctrl+Shift+Z'),' — '+T.undo+' / '+T.redo),
            h('div',null,h('span',{className:'kbd'},'Del'),' — '+T.delete),
            h('div',null,h('span',{className:'kbd'},'Shift+Click'),' — multi-select, then Del'),
            h('div',null,h('span',{className:'kbd'},'Ctrl+D'),' — '+T.dup),
            h('div',null,h('span',{className:'kbd'},'↑↓←→'),' — nudge  (+Shift = 10px)')
          )
        ):
        h('div',null,
          h('div',{className:'grp'},
            h('button',{className:'btn-o',type:'button',onClick:()=>dup(selEl.id)},T.dup),
            h('button',{className:'btn-o',type:'button',onClick:()=>front(selEl.id)},T.front),
            h('button',{className:'btn danger',type:'button',onClick:()=>del(selEl.id)},T.delete)
          ),
          selEl.type==='text'&&h(React.Fragment,null,
            h('label',{className:'lbl'},T.text),
            h('textarea',{rows:3,value:selEl.text,onChange:e=>update(selEl.id,{text:e.target.value})}),
            h('label',{className:'lbl'},T.ff),
            h('select',{className:'prop',value:selEl.fontFamily,onChange:e=>update(selEl.id,{fontFamily:e.target.value})},
              FONTS.map(f=>h('option',{key:f.l,value:f.v},f.l))),
            h('div',{className:'row2'},
              h('div',null,h('label',{className:'lbl'},T.fontSize),h('input',{type:'number',value:selEl.fontSize,onChange:e=>update(selEl.id,{fontSize:+e.target.value})})),
              h('div',null,h('label',{className:'lbl'},T.color),h('input',{type:'color',value:selEl.color,onChange:e=>update(selEl.id,{color:e.target.value})}))
            ),
            h('label',{className:'lbl'},T.align),
            h('select',{className:'prop',value:selEl.align,onChange:e=>update(selEl.id,{align:e.target.value})},
              h('option',{value:'left'},T.left),h('option',{value:'center'},T.center),h('option',{value:'right'},T.right)),
            h('label',{className:'chk'},h('input',{type:'checkbox',checked:selEl.bold,onChange:e=>update(selEl.id,{bold:e.target.checked})}),T.bold),
            h('label',{className:'chk'},h('input',{type:'checkbox',checked:selEl.italic,onChange:e=>update(selEl.id,{italic:e.target.checked})}),T.ital),
            h('label',{className:'chk'},h('input',{type:'checkbox',checked:selEl.underline,onChange:e=>update(selEl.id,{underline:e.target.checked})}),T.und)
          ),
          (selEl.type==='shape'||selEl.type==='line')&&h(React.Fragment,null,
            h('label',{className:'lbl'},T.color),h('input',{type:'color',value:selEl.color,onChange:e=>update(selEl.id,{color:e.target.value})}),
            h('label',{className:'lbl'},T.border),h('input',{type:'number',value:selEl.border,onChange:e=>update(selEl.id,{border:+e.target.value})}),
            selEl.type==='shape'&&h(React.Fragment,null,h('label',{className:'lbl'},T.radius),h('input',{type:'number',value:selEl.radius,onChange:e=>update(selEl.id,{radius:+e.target.value})}))
          ),
          selEl.type==='image'&&h('div',null,
            h('label',{className:'lbl'},T.imgTools||'Image tools'),
            h('div',{className:'grp'},
              h('button',{className:'btn-o',type:'button',disabled:busy,onClick:()=>{setBusy(true);removeBg(selEl.orig,out=>{update(selEl.id,{src:out});setBusy(false);});}},busy?T.removing:('🪄 '+T.removeBg)),
              h('button',{className:'btn-o',type:'button',disabled:busy,onClick:()=>{setBusy(true);sharpenImg(selEl.src,out=>{update(selEl.id,{src:out});setBusy(false);});}},busy?T.removing:('✨ '+(T.sharpen||'Sharpen'))),
              h('button',{className:'btn-o',type:'button',onClick:()=>update(selEl.id,{src:selEl.orig})},'↺ '+T.restore),
              h('button',{className:'btn gold',type:'button',onClick:()=>openManualEraser(selEl.src,selEl.orig,out=>update(selEl.id,{src:out}))},'✂️ '+(T.manualErase||'Manual erase'))
            ),
            h('label',{className:'lbl'},T.customBg||'Remove a specific leftover color'),
            h('div',{className:'row2'},
              h('div',null,
                h('input',{type:'color',value:customColor,style:{width:'100%'},onChange:e=>setCustomColor(e.target.value)})
              ),
              h('div',null,
                h('button',{className:'btn-o',type:'button',style:{width:'100%'},disabled:busy,onClick:()=>pickColorFromImage(selEl.src,hex=>setCustomColor(hex))},T.eyedrop||'🎯 Pick from image')
              )
            ),
            h('label',{className:'lbl'},(T.tolerance||'Tolerance')+': '+customTol),
            h('input',{type:'range',min:0,max:100,value:customTol,style:{width:'100%'},onChange:e=>setCustomTol(+e.target.value)}),
            h('button',{className:'btn-o',type:'button',style:{width:'100%',marginTop:6},disabled:busy,onClick:()=>{setBusy(true);customRemoveBg(selEl.src,customColor,customTol,out=>{update(selEl.id,{src:out});setBusy(false);});}},busy?T.removing:('🧹 '+(T.applyCustom||'Remove this color'))),
          ),
          h('div',{className:'row2',style:{marginTop:10}},
            h('div',null,h('label',{className:'lbl'},T.width),h('input',{type:'number',value:Math.round(selEl.w),onChange:e=>update(selEl.id,{w:+e.target.value})})),
            h('div',null,h('label',{className:'lbl'},T.height),h('input',{type:'number',value:Math.round(selEl.h),onChange:e=>update(selEl.id,{h:+e.target.value})}))
          )
        )
      )
    ),
    confirmDlg?h('div',{className:'tpl-overlay',style:{zIndex:99999}},
      h('div',{className:'confirm-box'},
        h('p',null,confirmDlg.message),
        h('div',{className:'grp',style:{justifyContent:'flex-end'}},
          h('button',{className:'btn-o',type:'button',onClick:()=>setConfirmDlg(null)},T.cancel||'Cancel'),
          h('button',{className:'btn danger',type:'button',onClick:()=>{const fn=confirmDlg.onYes;setConfirmDlg(null);fn();}},T.ok||'OK')
        )
      )
    ):null,
    showGallery?h('div',{className:'tpl-overlay',onClick:e=>{if(e.target===e.currentTarget) setShowGallery(false);}},
      h('div',{className:'tpl-modal'},
        h('div',{className:'tpl-modal-head'},
          h('span',null,'🖼 '+T.preset),
          h('button',{className:'btn-o',type:'button',onClick:()=>setShowGallery(false)},'✕')
        ),
        h('div',{className:'tpl-grid'},
          TEMPLATES.map(t=>h('div',{className:'tpl-card',key:t.id,onClick:()=>useTemplate(t.id)},
            renderTplPreview(t),
            h('div',{className:'tpl-label'},lang==='bn'?t.labelBn:t.labelEn)
          ))
        )
      )
    ):null,
    h('div',{className:'toast'+(toast?' show':'')},toast||'\u00A0')
  );
}
export default App;
