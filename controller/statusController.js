const { admin } = require('../db/config');
const { getData } = require('../utils');

const createStatus = async (req, res) => {
  const {user_id, nama_pengguna, img_profil, img_status} = req.body
  console.log(req.body);

  try {
    const timestamp = admin.firestore.Timestamp.now();

    const data = {user_id, nama_pengguna, img_profil, img_status, time: timestamp}

    await admin.firestore().collection('status').add(data)
    res.status(201).json({status: true, message: 'Berhasil membuat status'})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({status: false, message: 'Gagal Membuat Status' });
  }

}

const getAllStatus = async (req, res) => {
  try {
    const doc = await admin.firestore().collection('status').orderBy('time', 'desc').get()
    const data = getData(doc)
    res.status(200).json({status: true, message: 'Berhasil mengambil data status', data})

  } catch (error) {
    console.log(error);
    res.status(500).json({status: false, message: 'Gagal mengambil data Status' });
  }
}

const getStatusByUserId = async (req, res) => {
  const {user_id} = req.params

  try {
    const doc = await admin.firestore().collection('status')
    .where('user_id', '==', user_id)
    .orderBy('time', 'desc')
    .get()

    const data = getData(doc)

    if (!data) {
      res.status(404).json({status: false, message: 'Data status tidak ditemukan', data: [] });
    }

    res.status(201).json({status: true, message: 'Berhasil mengambil data status user', data: data });

  } catch (error) {
    console.log(error);
    res.status(500).json({status: false, message: 'Gagal mengambil data status user' });
  }
}

const deleteStatusById = async (req, res) => {
  const {id} = req.params
  try {
    const doc = admin.firestore().collection('status').doc(id)
    await doc.delete()
    res.status(201).json({status: true, message: 'Status berhasil di delete'})
  } catch (error) {
    console.log(error);
    res.status(500).json({status: false, message: 'Status gagal di delete' });
  }
}

const deleteOldStatus = async (req, res) => {
  try {

    const snapshot = await admin.firestore().collection('status')
    .where('time', '<=', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
    .get()

    const data = getData(snapshot)

    const batch = admin.firestore().batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(201).json({ status: true, message: 'Data status yang lama sudah dihapus', data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Gagal menghapus data status yang lama' });
  }
};






module.exports = {
  createStatus,
  getAllStatus,
  getStatusByUserId,
  deleteStatusById,
  deleteOldStatus
}