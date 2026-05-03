const router = require('express').Router();
const answerController = require('../controllers/answer.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, answerController.create);
router.get('/', answerController.getByQuestion);
router.put('/:id', auth, answerController.update);
router.delete('/:id', auth, answerController.remove);

module.exports = router;
