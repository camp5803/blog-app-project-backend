import db from '../database/index.js';
import { sequelize } from 'sequelize';
import { bookmark } from '@/database/model/bookmark.js';
import { post } from '@/database/model/post.js';
const { Post, Image, Category, Profile, Neighbor, Bookmark, Like } = db;

export const createPost = async (postData) => {
        try {
            const { user_id, title, content, categories, img } = postData;
            console.log('repository', postData);

            console.log(img)
    
            const post = await Post.create({
                user_id,
                title,
                content,
                categories,
                thumbnail: img[0],
                view: 0,
                like: 0
            });

            if (categories && categories.length > 0) {
                for (const categoryName of categories) {
                    const category = await Category.create({
                        post_id: post.post_id, 
                        category: categoryName,
                    });
    
                    await post.addCategory(category); 
                }
            }

            if(img && img.length > 0) {
                for (let i = 0; i < img.length; i++) {
                    const image = await Image.create({
                        post_id: post.post_id,
                        image: img[i], // 이미지 배열의 순서대로 저장
                    });
                    await post.addImage(image);
                }
            }
           
            const dbCategories = await post.getCategories();
            const dbPost = await Post.findOne({ where: {post_id: post.post_id} });

            console.log('dbCategories::', dbCategories);
            console.log('dbPost::', dbPost);
            return post.post_id;
        } catch (error) {
            console.log(error)
            throw new Error('Error creating post in repository');
        }
    }


export const updatePost = async (postData) => {
    
    try {
        console.log('repository', postData);
    
        const { post_id, title, content, img } = postData;
        
        console.log(postData)
        const [post] = await Post.update({title, content, updated_at: new Date()}, 
        { where: { post_id: post_id } }) 

        // 게시물이 없는 경우
        if (post === 0) {
            return 0;
        }
        if (img && img.length > 0) {
            for (let i = 0; i < img.length; i++) {
                // 이미지 업데이트
                await Image.update({ image: img[i] }, { where: { post_id: post_id } });
        
                // 이미지가 있을 때만 연결
                if (post && post.addImage) {
                    const image = await Image.findOne({ where: { post_id: post_id } });
                    if (image) {
                        await post.addImage(image);
                    }
                }
            }
        }

        return post;
    } catch (error) {
        console.log(error);
        throw new Error('Error updating post in repository');
    }
}

export const deletePost = async (postId) => {

    try {
        console.log('repository:::', postId)
        const post = await Post.destroy({where: { post_id: postId }});
        console.log('delete post row : ', post) // 1 정상적으로 삭제될 경우

        if (post === 0) {
            // 이미 삭제된 경우
            throw new Error('Post not found');
        }

        return post;
    } catch (error) {
        console.log(error);
        throw new Error('Error delete post in repository');
    }
}

export const getByPostDetail = async (postId, user_id) => {
    try {
        console.log('repository ::', postId)
        const post = await Post.findOne({where: { post_id: postId }});
        post.view += 1;
        await post.save();

        const userProfile = await Profile.findOne({where: {user_id: post.user_id}})
        const like = await Like.findOne({ where: { user_id: user_id, post_id: postId } });

        const liked = !!like; // 좋아요 여부를 불리언으로 설정

        const categories = await post.getCategories();
        const images = await post.getImages();

        const resData = {
            post_id: post.post_id,
            nickname: userProfile.nickname,
            title: post.title,
            content: post.content,
            view: post.view,
            like: post.like,
            liked: liked,
            categories: categories.map((category) => category.category),
            createdDt: post.created_at,
            img: images.map((image) => image.image)
        };
        console.log(resData)
        return resData;
    } catch (error) {
        console.log(error);
        throw new Error('Error delete post in repository');
    }
}

export const getPostsByPage = async (page, pageSize, order, id, sort) => {
    try {
        console.log('order', order);
        const offset = (page - 1) * pageSize;
        const whereClause = {}; // whereClause를 정의
        const limit = pageSize;

        const neighbor = await Neighbor.findOne({where: {user_id: id}});
        console.log(neighbor);
        let posts;

        if (sort === 'neighbor') {
          // 이웃 글 목록을 가져옴
          const neighbor = await Neighbor.findOne({ where: { user_id: id } });
          posts = await Post.findAndCountAll({
            where: { user_id: neighbor.follows_to },
            offset,
            limit,
            include: [
              {
                model: Category,
                as: 'categories',
                attributes: ['category'],
              },
            ],
            order: [['created_at', 'DESC']],
          });
        } else {
          // 그 외의 경우 전체 글 목록을 가져옴
          posts = await Post.findAndCountAll({
            where: whereClause,
            offset,
            limit,
            include: [
              {
                model: Category,
                as: 'categories',
                attributes: ['category'],
              },
            ],
            order: order,
          });
        }

        const resultPosts = [];
      
         // 각 포스트마다 사용자 정보 추가
         for (const post of posts.rows) {
            const userProfile = await Profile.findOne({ where: { user_id: post.user_id } });
            post.dataValues.nickname = userProfile.nickname;

            const bookmark = await Bookmark.findOne({ where: { post_id: post.post_id } });
            post.dataValues.bookmarked = !!bookmark;

            const like = await Like.findOne({ where: { user_id: id, post_id: post.post_id } });
            const liked = !!like; // 좋아요 여부를 불리언으로 설정

            resultPosts.push({
                post_id: post.post_id,
                thumbnail: post.thumbnail,
                title: post.title,
                content: post.content,
                nickname: post.dataValues.nickname,
                created_at: post.created_at,
                categories: post.categories.map((category) => category.category),
                bookmarked: post.dataValues.bookmarked,
                view: post.view,
                like: post.like,
                liked: liked, // 좋아요 여부 추가
            });
        } 
        const rowLength = posts.rows.length;
        const hasMore = rowLength === pageSize;

        return {
            posts: resultPosts,
            hasMore: hasMore,
        };
    } catch (error) {
        console.log(error); 

        throw new Error('Error get post in repository');
    }
}; 

export const toggleBookmark = async (user_id, post_id) => {
    try {
   
    const existBookmark = await Bookmark.findOne({ where: { user_id, post_id } });

    if (existBookmark) {
        await Bookmark.destroy({ where: { user_id, post_id } });
        console.log(`Bookmark removed: user_id ${user_id}, post_id ${post_id}`);
        return 'remove'; 
    } else {
        const newBookmark = await Bookmark.create({ user_id, post_id });
        console.log(`Bookmark added: user_id ${user_id}, post_id ${post_id}`);
        return 'add'; 
    }
     
    } catch (error) {
        console.log(error); 
        throw new Error('Error get post in repository');
    }
}

export const toggleLike = async (user_id, post_id) => {
    try {
        const existLike = await Like.findOne({where: { user_id, post_id }});
        const post = await Post.findOne({where: { user_id, post_id }})

        if (existLike) {
            await Like.destroy({ where: { user_id, post_id } });
            post.like -= 1;
            await post.save();
            return 'cancel';
        } else {
            // Like 테이블에 좋아요를 누른 유저와 post_id를 추가
            await Like.create({ user_id, post_id }); // 수정된 부분
            post.like += 1;
            await post.save();
            return 'like';
        }
    } catch (error) {
        console.log(error); 
        throw new Error('Error get post in repository');
    }
}
  