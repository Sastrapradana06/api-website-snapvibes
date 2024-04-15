const { admin } = require('../db/config');


const login = async (req, res) => {
  const {nama_pengguna, password} = req.body
  console.log({nama_pengguna, password});

  try {
    const snapshot = await admin.firestore().collection('user')
    .where('nama_pengguna', '==', nama_pengguna)
    .where('password', '==', password)
    .get();

    if (snapshot.empty) {
      res.status(404).json({ status: false, message: 'Nama pengguna atau password salah!' });
    } else {
      let userData;
      snapshot.forEach(doc => {
        userData = {
          id: doc.id,
          data: doc.data()
        };
      });
      res.status(200).json({ status: true, message: 'Nama pengguna ditemukan', data:userData });
    }
    
  } catch (error) {
    res.status(500).json({status: false, message: 'Error' });
  }
}

const register = async (req, res) => {
  const { username, nama_pengguna, email, password } = req.body;

  try {
    const snapshotNamaPengguna = await admin.firestore().collection('user')
      .where('nama_pengguna', '==', nama_pengguna)
      .get();
    const snapshotEmail = await admin.firestore().collection('user')
      .where('email', '==', email)
      .get();

    if (!snapshotNamaPengguna.empty) {
      res.status(404).json({ status: false, message: 'Nama pengguna sudah ada' });
    } else if(!snapshotEmail.empty) {
      res.status(404).json({ status: false, message: 'Email sudah digunakan' });
    } else {
      const userData = {
        username,
        nama_pengguna,
        email,
        password,
        bio: '',
        tautan: '',
        img_profil: '/icon.jfif',
        mengikuti: [],
        pengikut: [],
      };

      await admin.firestore().collection('user').add(userData);

      res.status(200).json({ status: true, message: 'Berhasil Register', data: userData });

    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error' });
  }
}


module.exports = {login, register}