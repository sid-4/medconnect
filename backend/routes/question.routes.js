const router = require('express').Router();
const questionController = require('../controllers/question.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, questionController.create);
router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.put('/:id', auth, questionController.update);
router.delete('/:id', auth, questionController.remove);

module.exports = router;
