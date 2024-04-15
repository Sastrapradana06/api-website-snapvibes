const { admin } = require('../db/config');
const { getData, updateNamaPenggunaInPostingan } = require('../utils');

async function getUser(req, res) {
  try {
    const snapshot = await admin.firestore().collection('user').get();
    const dataUser = getData(snapshot)
    res.status(202).json({status: true, message: 'Berhasil mengambil data pengguna', data: dataUser });
  } catch (error) {
      res.status(500).json({status: true, message: 'Gagal mengambil data pengguna' });
  }
}

async function getUserByNamaPengguna(req, res) {
  const { nama_pengguna } = req.params;

  try {
    const snapshot = await admin.firestore().collection('user').where('nama_pengguna', '==', nama_pengguna).get();
    
    if (snapshot.empty) {
      res.status(404).json({ status: false, message: 'Pengguna tidak ditemukan' });
    } else {
      const dataUser = getData(snapshot);
      res.status(200).json({ status: true, message: 'Berhasil mengambil data pengguna', data: dataUser });
    }
  } catch (error) {
    console.error('Error getting user by nama_pengguna:', error);
    res.status(500).json({ status: false, message: 'Gagal mengambil data pengguna' });
  }
}

async function getUserIncludeNamaPengguna(req, res) {
  const { nama_pengguna } = req.params;

  try {
    const snapshot = await admin.firestore().collection('user').get();
    const dataUsers = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.nama_pengguna.includes(nama_pengguna)) {
        dataUsers.push(data);
      }
    });

    if (dataUsers.length === 0) {
      res.status(404).json({ status: false, message: 'Pengguna tidak ditemukan' });
    } else {
      res.status(200).json({ status: true, message: 'Berhasil mengambil data pengguna', data: dataUsers });
    }
  } catch (error) {
    console.error('Error getting user by nama_pengguna:', error);
    res.status(500).json({ status: false, message: 'Gagal mengambil data pengguna' });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const userRef = admin.firestore().collection('user').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'Pengguna tidak ditemukan' });
      return;
    }

    const userData = userDoc.data();
    res.status(200).json({ status: true, message: 'Data pengguna berhasil diambil', data: userData });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
}

async function editUser(req, res) {
  const {id, newData} = req.body
  try {
    const {nama_pengguna, email} = newData

    // email digunakan untuk mengambil data user saja & email tidak boleh di edit
    const snapshotEmail = await admin.firestore().collection('user')
      .where('email', '==', email)
      .get();

      if (!snapshotEmail.empty) {
        const userData = getData(snapshotEmail)
        const {data} = userData[0]

        // cek jika nama_pengguna masih sama dengan nama_pengguna dari new data
        if(data.nama_pengguna == nama_pengguna) {
          const userRef = admin.firestore().collection('user').doc(id);
          // tetep boleh di edit
          await userRef.update(newData);
          const updatedUser = await userRef.get();
          res.status(200).json({ status: true, message: 'Data pengguna berhasil di edit', data: updatedUser.data()});
        } else {
          // jika tidak sama di cek apakah nama_pengguna dari new data ada tidak didalam collection user
          const snapshotNamaPengguna = await admin.firestore().collection('user')
            .where('nama_pengguna', '==', nama_pengguna)
            .get();

            // jika ada maka user tidak bisa di edit karena nama_pengguna ada yang sama
          if(!snapshotNamaPengguna.empty) {
            res.status(404).json({ status: false, message: 'Nama pengguna sudah ada' });
          } else {
            // jika tidak maka user boleh edit nama_pengguna
            const userRef = admin.firestore().collection('user').doc(id);
            await userRef.update(newData);
            await updateNamaPenggunaInPostingan(id, nama_pengguna)

            const updatedUser = await userRef.get();
            res.status(200).json({ status: true, message: 'Data pengguna berhasil di edit', data: updatedUser.data()});
          }

        }
      }  else {
        res.status(500).json({ error: 'Gagal mengambil data pengguna' });
      }


  } catch (error) {
      res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
}

async function handleIkutiUser(req, res) {
  const { id_pengguna, id_user } = req.body;

  try {
    const docRefPengguna = admin.firestore().collection('user').doc(id_pengguna); 
    const docRefUser = admin.firestore().collection('user').doc(id_user); 
    const docPengguna = await docRefPengguna.get()
    const docUser = await docRefUser.get()

    if(docPengguna.exists && docUser.exists) {
      const { pengikut } = docPengguna.data();

      if(pengikut && pengikut.includes(id_user)) {
        
        await docRefPengguna.update({
          pengikut: admin.firestore.FieldValue.arrayRemove(id_user)
        })
        await docRefUser.update({
          mengikuti: admin.firestore.FieldValue.arrayRemove(id_pengguna)
        })
        const updatedDoc = await docRefPengguna.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Berhenti mengikuti', data:dataUpdate });

      } else {
        await docRefPengguna.update({
          pengikut: admin.firestore.FieldValue.arrayUnion(id_user),
        });
        await docRefUser.update({
          mengikuti: admin.firestore.FieldValue.arrayUnion(id_pengguna),
        });

        const updatedDoc = await docRefPengguna.get();
        const dataUpdate = {id:updatedDoc.id, ...updatedDoc.data()}
        res.status(200).json({ status: true, message: 'Anda berhasil mengikuti', data:dataUpdate});
      }
    } else {
      res.status(404).json({ status: false, message: 'Dokumen tidak ditemukan' });
    }

  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ status: false, message: 'Gagal Menyukai' });
  }
}


module.exports = {
  getUser,
  editUser,
  getUserById,
  getUserByNamaPengguna,
  getUserIncludeNamaPengguna,
  handleIkutiUser
};