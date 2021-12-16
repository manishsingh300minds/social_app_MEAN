const Post = require('../model/dataModel');

exports.getPosts = (req, res) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if(pageSize && currentPage){
        postQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)
    }
    // then() can be use to get the data received from frontend
    postQuery.then((documents) => {
        fetchedPost = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            msg : "Posts fetched successfully",
            posts : fetchedPost,
            maxPosts: count
        })
    }).catch(error => {
        res.status(500).json({
            message : 'Fetching post failed'
        })
    })
}

exports.addPost = (req, res) => {
    // protocol http / https ---> :// for full url
    const url = req.protocol + '://' + req.get("host");
    const postData = new Post({
        title : req.body.title,
        description : req.body.description,
        image: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    postData.save().then(addedPost => {
        res.status(201).json({
            msg: "Added the new post successfully",
            post: {
                ...addedPost,
                id : addedPost._id,
            }
        })
            .catch(error => {
                res.status(500).json({
                    message: 'Failed to upload your Post. Please try again.'
                })
            })
    });
}

exports.updatePost = (req,res) => {
    let imagePath = req.body.image;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const editedPost = new Post({
        _id : req.params.id,
        title : req.body.title,
        description : req.body.description,
        image : imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id : req.params.id, creator: req.userData.userId},editedPost).then(result => {
        console.log('On update',result);
        if(result.modifiedCount > 0){
            res.status(200).json({
                msg : 'Update successful!!'
            })
        } else{
            res.status(401).json({
                message : 'Unauthorized User!!'
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Failed to update your Post. Please try again.'
        })
    });
}

exports.deletePost = (req ,res) => {
    Post.deleteOne({_id: req.params.id,creator: req.userData.userId})
        .then(result => {
            console.log('on delete',result);
            if(result.deletedCount > 0){
                res.status(200).json({
                    msg : 'Deletion successful!!'
                });
            } else{
                res.status(401).json({
                    msg : 'Unauthorized User!!'
                });
            }
        }).catch(error => {
        res.status(500).json({
            message: 'Failed to delete the Post. Please try again.'
        })
    });
}
