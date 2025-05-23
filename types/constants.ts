export const usernameReg = /^[a-zA-Z0-9_]{3,32}$/
export const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export enum ToastMessageType {
  TypeError = 'error',
  TypeInfo = 'info',
  TypeSuccess = 'success',
}

export const ToastMessageDelay = 5000

export enum HttpError {
  Forbidden = 403,
}

export const ItemPerPage = 20

export enum DrugUnit {
  Mg = 'mg',
  G = 'g',
  Kg = 'kg',
  Ml = 'ml',
  L = 'l',
  Mcg = 'µg',
  Oz = 'oz',
  Lb = 'lb',
  FlOz = 'fl oz',
  Pt = 'pt',
  Qt = 'qt',
  Gal = 'gal',
  Tbsp = 'tbsp',
  Tsp = 'tsp',
  Unit = 'unit',
}

export const DrugUnitTranslations = {
  [DrugUnit.Mg]: 'mg',
  [DrugUnit.G]: 'g',
  [DrugUnit.Kg]: 'kg',
  [DrugUnit.Ml]: 'ml',
  [DrugUnit.L]: 'l',
  [DrugUnit.Mcg]: 'µg',
  [DrugUnit.Oz]: 'oz',
  [DrugUnit.Lb]: 'lb',
  [DrugUnit.FlOz]: 'fl oz',
  [DrugUnit.Pt]: 'pt',
  [DrugUnit.Qt]: 'qt',
  [DrugUnit.Gal]: 'gal',
  [DrugUnit.Tbsp]: 'tbsp',
  [DrugUnit.Tsp]: 'tsp',
  [DrugUnit.Unit]: 'unité',
}

export enum DrugForm {
  Tablets = 'tablets',
  Capsules = 'capsules',
  Syrup = 'syrup',
  Injection = 'injection',
  Inhaler = 'inhaler',
  Cream = 'cream',
  Ointment = 'ointment',
  Gel = 'gel',
  Drops = 'drops',
  Suppository = 'suppository',
  Solution = 'solution',
  Suspension = 'suspension',
  Spray = 'spray',
  Patch = 'patch',
  Lozenge = 'lozenge',
  Powder = 'powder',
  Granules = 'granules',
  Paste = 'paste',
  Lotion = 'lotion',
  Shampoo = 'shampoo',
  Foam = 'foam',
  Emulsion = 'emulsion',
  Mouthwash = 'mouthwash',
  Gargle = 'gargle',
  Enema = 'enema',
  VaginalCream = 'vaginal cream',
  VaginalTablet = 'vaginal tablet',
  VaginalGel = 'vaginal gel',
  VaginalSuppository = 'vaginal suppository',
  VaginalRing = 'vaginal ring',
  VaginalInsert = 'vaginal insert',
  VaginalCapsule = 'vaginal capsule',
  VaginalFoam = 'vaginal foam',
  VaginalOintment = 'vaginal ointment',
  VaginalSpray = 'vaginal spray',
  VaginalDouche = 'vaginal douche',
  VaginalWash = 'vaginal wash',
  VaginalSolution = 'vaginal solution',
  VaginalEmulsion = 'vaginal emulsion',
  VaginalLotion = 'vaginal lotion',
  VaginalPowder = 'vaginal powder',
  VaginalGranules = 'vaginal granules',
  VaginalPaste = 'vaginal paste',
  VaginalLozenge = 'vaginal lozenge',
  VaginalPatch = 'vaginal patch',
  VaginalDrops = 'vaginal drops',
  VaginalSuspension = 'vaginal suspension',
}

export const DrugFormTranslations = {
  [DrugForm.Tablets]: 'Comprimés',
  [DrugForm.Capsules]: 'Capsules',
  [DrugForm.Syrup]: 'Sirop',
  [DrugForm.Injection]: 'Injection',
  [DrugForm.Inhaler]: 'Inhalateur',
  [DrugForm.Cream]: 'Crème',
  [DrugForm.Ointment]: 'Pommade',
  [DrugForm.Gel]: 'Gel',
  [DrugForm.Drops]: 'Gouttes',
  [DrugForm.Suppository]: 'Suppositoire',
  [DrugForm.Solution]: 'Solution',
  [DrugForm.Suspension]: 'Suspension',
  [DrugForm.Spray]: 'Spray',
  [DrugForm.Patch]: 'Patch',
  [DrugForm.Lozenge]: 'Pastille',
  [DrugForm.Powder]: 'Poudre',
  [DrugForm.Granules]: 'Granulés',
  [DrugForm.Paste]: 'Pâte',
  [DrugForm.Lotion]: 'Lotion',
  [DrugForm.Shampoo]: 'Shampooing',
  [DrugForm.Foam]: 'Mousse',
  [DrugForm.Emulsion]: 'Émulsion',
  [DrugForm.Mouthwash]: 'Bain de bouche',
  [DrugForm.Gargle]: 'Gargarisme',
  [DrugForm.Enema]: 'Lavement',
  [DrugForm.VaginalCream]: 'Crème vaginale',
  [DrugForm.VaginalTablet]: 'Comprimé vaginal',
  [DrugForm.VaginalGel]: 'Gel vaginal',
  [DrugForm.VaginalSuppository]: 'Suppositoire vaginal',
  [DrugForm.VaginalRing]: 'Anneau vaginal',
  [DrugForm.VaginalInsert]: 'Insert vaginal',
  [DrugForm.VaginalCapsule]: 'Capsule vaginale',
  [DrugForm.VaginalFoam]: 'Mousse vaginale',
  [DrugForm.VaginalOintment]: 'Pommade vaginale',
  [DrugForm.VaginalSpray]: 'Spray vaginal',
  [DrugForm.VaginalDouche]: 'Douche vaginale',
  [DrugForm.VaginalWash]: 'Lavage vaginal',
  [DrugForm.VaginalSolution]: 'Solution vaginale',
  [DrugForm.VaginalEmulsion]: 'Émulsion vaginale',
  [DrugForm.VaginalLotion]: 'Lotion vaginale',
  [DrugForm.VaginalPowder]: 'Poudre vaginale',
  [DrugForm.VaginalGranules]: 'Granulés vaginaux',
  [DrugForm.VaginalPaste]: 'Pâte vaginale',
  [DrugForm.VaginalLozenge]: 'Pastille vaginale',
  [DrugForm.VaginalPatch]: 'Patch vaginal',
  [DrugForm.VaginalDrops]: 'Gouttes vaginales',
  [DrugForm.VaginalSuspension]: 'Suspension vaginale',
}

export enum ApiError {
  API_ERROR_SIMILAR_DATA = 'A similar user drug already exists',
}

export enum CustomRecordView {
  Calendar = 'CALENDAR',
}

export enum COOKIE {
  'APP_VERSION_CHECKED' = 'app_version_checked',
  'API_VERSION_CHECKED' = 'api_version_checked',
}
