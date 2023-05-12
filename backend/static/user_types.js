const user_types = new Map();

user_types.set('224608005 - Administrative healthcare staff', {
   designation: 'Administrative healthcare staff',
   code: 224608005,
   permissions: {
      create_users: true,
      create_forms: false,
      view_forms: false,
      view_fhir: false
      }
   });

user_types.set('18850004 - Laboratory hematologist', {
   designation: 'Laboratory hematologist',
   code: 18850004,
   permissions: {
      create_users: false,
      create_forms: true,
      view_forms: true,
      view_fhir: true
      }
   });

user_types.set('61246008 - Laboratory medicine specialist', {
   designation: 'Laboratory medicine specialist',
   code: 61246008,
   permissions: {
      create_users: false,
      create_forms: true,
      view_forms: true,
      view_fhir: true
      }
   });

user_types.set('224529009 - Clinical assistant', {
   designation: 'Clinical assistant',
   code: 224529009,
   permissions: {
      create_users: false,
      create_forms: false,
      view_forms: true,
      view_fhir: true
      }
   });

module.exports = user_types;