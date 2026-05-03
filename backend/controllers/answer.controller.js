const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.create = async (req, res) => {
  try {
    const { content, questionId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const answer = new Answer({
      content,
      questionId,
      author: req.user.id
    });
    await answer.save();
    await answer.populate('author', 'username');

    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');

    const questionAuthorId = question.author.toString();
    const socketId = connectedUsers.get(questionAuthorId);

    io.emit('answer:new', {
      questionId,
      answer
    });

    if (socketId && questionAuthorId !== req.user.id) {
      io.to(socketId).emit('notification:new', {
        message: `${req.user.username} answered your question: "${question.title}"`,
        questionId,
        answerId: answer._id,
        createdAt: new Date()
      });
    }

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.query.questionId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }
    if (answer.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    answer.content = req.body.content || answer.content;
    await answer.save();
    await answer.populate('author', 'username');
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }
    if (answer.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await answer.deleteOne();
    res.json({ message: 'Answer deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
