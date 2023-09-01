import db from '../database/index.js';
import { sequelize } from 'sequelize';
const { Post, Image, Category, Profile, Neighbor, Bookmark } = db;

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
                thumbnail: img[0]
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

        const updatedPost = await Post.findOne({ where: { post_id } });
        const updatedImage = await Image.findOne({ where: { post_id } });
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

export const getByPostDetail = async (postId) => {
    try {
        console.log('repository ::', postId)
        const post = await Post.findOne({where: { post_id: postId }});
        const userProfile = await Profile.findOne({where: {user_id: post.user_id}})

        const categories = await post.getCategories();
        const images = await post.getImages();

        const resData = {
            post_id: post.post_id,
            nickname: userProfile.nickname,
            title: post.title,
            content: post.content,
            view: post.view,
            like: post.like,
            categories: categories.map((category) => category.category),
            createdDt: post.created_at,
            image: images.map((image) => image.image)
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
      
         // 각 포스트마다 사용자 정보 추가
         for (const post of posts.rows) {
            const userProfile = await Profile.findOne({ where: { user_id: post.user_id } });
           
            post.dataValues.nickname = userProfile.nickname;
        } 
 
        const rowLength = posts.rows.length;

        const hasMore = rowLength === pageSize;

        return {
            posts: posts.rows.map((post) => ({
                post_id: post.post_id,
                thumbnail: post.thumbnail,
                title: post.title,
                content: post.content,
                nickname: post.dataValues.nickname,
                created_at: post.created_at, // 생성일 컬럼명 수정
                categories: post.categories.map((category) => category.category),
                view: post.view,
                like: post.like,
            })),
            hasMore: hasMore, // boolean으로 다음 페이지 여부 판단
        };
    } catch (error) {
        console.log(error); 

        throw new Error('Error get post in repository');
    }
}; 

export const addBookmark = async (user_id, post_id) => {
    try {
        const bookmark = await Bookmark.create({user_id: user_id, post_id: post_id});
        console.log(bookmark);
        return bookmark;
    } catch (error) {
        console.log(error); 
        throw new Error('Error get post in repository');
    }
}

export const removeBookmark = async (post_id) => {
    try {
        const bookmark = await Bookmark.destroy({where: {post_id: post_id}})
        console.log(bookmark)
          // 게시물이 없는 경우
          if (bookmark === 0) {
            return 0;
        }
        return bookmark;
    } catch (error) {
        console.log(error); 
        throw new Error('Error get post in repository');
    }
}
  