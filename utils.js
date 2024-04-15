const {admin} = require('./db/config');


const getData = (data) => {
  const datas = [];
  data.forEach(doc => {
      datas.push({
          id: doc.id,
          data: doc.data()
      });
  });
  return datas
}

async function fetchUserByEmail(email) {
  const snapshot = await admin.firestore().collection('user')
    .where('email', '==', email)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
}

async function fetchUserByNamaPengguna(nama_pengguna) {
  const snapshot = await admin.firestore().collection('user')
    .where('nama_pengguna', '==', nama_pengguna)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
}

async function updateNamaPenggunaInPostingan(id, newNamaPengguna) {
  try {
    const refPostingan = await admin.firestore().collection('postingan').where('user_id', '==', id).get();

    if (!refPostingan.empty) {
      const batch = admin.firestore().batch();

      refPostingan.forEach(doc => {
        const postinganRef = admin.firestore().collection('postingan').doc(doc.id);
        batch.update(postinganRef, { nama_pengguna: newNamaPengguna });
      });

      await batch.commit();
      console.log('Nama pengguna di postingan berhasil diubah');
    } else {
      console.log('Tidak ada postingan yang ditemukan untuk user dengan ID tersebut');
    }
  } catch (error) {
    console.error('Error updating nama_pengguna in postingan:', error);
  }
}



module.exports = {getData, fetchUserByEmail, fetchUserByNamaPengguna, updateNamaPenggunaInPostingan}