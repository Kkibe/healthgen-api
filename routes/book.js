const router = require('express').Router();
const Book = require('../models/Book');
const {verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken');
//CREATE A BOOK
router.post('/',verifyToken, async (req, res) => {
    const newBook = new Book(req.body);
    try{
        const savedBook = await newBook.save();
        res.status(200).json(savedBook);
    } catch (err) {
        res.status(500).json(err);
    }
})
//UPDATE A BOOK
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{ 
        const updatedBook = Book.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedBook);
    } catch (err) {
        return res.status(500).json(err);
    }
})
//DELETE A BOOK
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json('Book has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})
//GET A BOOK
router.get('/:id', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err);
    }
})
//Get ALL BOOKS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let books;
        if(qNew) {
            books= await new Book.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            books = await new Book.find({categories: {
                $in: [qCategory]
            }})
        } else {
            books = await Book.find();
        }
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;