var express = require('express');
var router = express.Router();

var FormController = require('../controller/Form');

/* GET users listing. */
router.post('/submit', async (req, res) => {
  const composition = {}
  composition.composition = JSON.parse(req.body.values)

  console.log('entrei',composition)
  let newFormResponse = FormController.newForm(composition);
  if (newFormResponse.success) {
    res.status(200).json({success: true, info: "FormComposition adicionado com sucesso!"});
  } else {
      res.status(200).json({success: false, info: "Erro ao adicionar FormComposition!"});
  };
});

module.exports = router;
