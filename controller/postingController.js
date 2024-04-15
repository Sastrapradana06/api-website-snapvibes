const { admin } = require('../db/config');
const { getData } = require('../utils');


const handlePosting = async (req, res) => {
  const {id, user_id, nama_pengguna, deskripsi, img_url, img_profil, love, bookmark} = req.body
  console.log({id});
  try {

    const timestamp = admin.firestore.Timestamp.now();

    const data = {
      user_id, 
      nama_pengguna, 
      deskripsi, 
      img_url, 
      img_profil, 
      love,
      bookmark,
      time: timestamp,
    };

    if(!id) {
      await admin.firestore().collection('postingan').add(data);
      
      res.status(200).json({ status: true, message: 'Berhasil Membuat Postingan' });
    } else {
      const refDoc = admin.firestore().collection('postingan').doc(id);

      await refDoc.update(data);
      const updatedPostingan = await refDoc.get();
      res.status(200).json({ status: true, message: 'Postingan Berhasil Di Update', data: updatedPostingan.data()});
    }
    
  } catch (error) {
    res.status(500).json({status: false, message: 'Gagal Membuat Postingan' });
  }
}

const getAllPostingan = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('postingan').orderBy('time', 'desc').get();
    const data = getData(snapshot)
    res.status(201).json({status: true, message: 'Berhasil mengambil data postingan', data });
  } catch (error) {
    console.log(error);
      res.status(500).json({status: false, message: 'Gagal mengambil data postingan' });
  }
}

const getPostinganById = async (req, res) => {
  const {id} = req.params
  try {
    const docRef = await admin.firestore().collection('postingan')
    .where('user_id', '==', id)
    .orderBy('time', 'desc')
    .get();

    const data = getData(docRef);

    if (!data) {
      res.status(404).json({status: false, message: 'Data postingan tidak ditemukan', data: [] });
    }

    res.status(201).json({status: true, message: 'Berhasil mengambil data postingan', data: data });
  } catch (error) {
    console.log(error);
      res.status(500).json({status: false, message: 'Gagal mengambil data postingan' });
  }
}

const handleLovePostingan = async (req, res) => {
  const { id, id_user } = req.body;

  try {
    const docRef = admin.firestore().collection('postingan').doc(id); 
    const doc = await docRef.get()

    if(doc.exists) {
      const { love } = doc.data();

      if(love && love.includes(id_user)) {
        
        await docRef.update({
          love: admin.firestore.FieldValue.arrayRemove(id_user)
        })
        const updatedDoc = await docRef.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Kenapa woi 👿', data:dataUpdate });

      } else {
        await docRef.update({
          love: admin.firestore.FieldValue.arrayUnion(id_user),
        });

        const updatedDoc = await docRef.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Anda menyukai postingan ini 😍', data:dataUpdate});
      }
    } else {
      res.status(404).json({ status: false, message: 'Dokumen tidak ditemukan' });
    }

  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ status: false, message: 'Gagal Menyukai' });
  }
};

const handlebookmark = async (req, res) => {
  const { id, id_user } = req.body;

  try {
    const docRef = admin.firestore().collection('postingan').doc(id); 
    const doc = await docRef.get()

    if(doc.exists) {
      const { bookmark } = doc.data();

      if(bookmark && bookmark.includes(id_user)) {
        
        await docRef.update({
          bookmark: admin.firestore.FieldValue.arrayRemove(id_user)
        })
        const updatedDoc = await docRef.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Kenapa woi 👿', data:dataUpdate });

      } else {
        await docRef.update({
          bookmark: admin.firestore.FieldValue.arrayUnion(id_user),
        });

        const updatedDoc = await docRef.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Anda menyukai postingan ini 😍', data:dataUpdate});
      }
    } else {
      res.status(404).json({ status: false, message: 'Dokumen tidak ditemukan' });
    }

  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ status: false, message: 'Gagal Menyukai' });
  }
};

const deletePostingan = async (req, res) => {
  const {id} = req.params
  try {
    const docRef = admin.firestore().collection('postingan').doc(id)
    await docRef.delete()
    res.status(200).json({status: true, message:'Postingan berhasil dihapus'})
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ status: false, message: 'Maaf ada kesalahan teknis' });
  }
}


module.exports = {
  handlePosting, 
  getAllPostingan, 
  getPostinganById, 
  handleLovePostingan,
  deletePostingan,
  handlebookmark
}