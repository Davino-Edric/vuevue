<template>
  <div>
    <header class="bg-dark-subtle mb-5 pb-2">
      <div class="d-flex container justify-content-between align-items-center">
        <p class="h1 mt-2">SMKN 1 Surabaya</p>
        <button class="btn btn-primary">Login</button>
      </div>
    </header>
      <div class="container mt-5">
        <div class="d-flex justify-content-end mt-3 mb-2 align-items-center">
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addmodal">Tambah</button>
        </div>
        <table class="table">
          <thead>
            <tr class="table-info">
              <th scope="col">No.</th>
              <th scope="col">NISN</th>
              <th scope="col">Nama</th>
              <th scope="col">Foto</th>
              <th scope="col">Tanggal pembuatan</th>
              <th scope="col">Action</th>
            </tr>
            <tr v-for="(item, index) in data" :key="index">
              <td class="align-items-center">{{ index+1 }}</td>
              <td class="align-items-center">{{ item.nisn }}</td>
              <td class="align-items-center">{{ item.name }}</td>
              <td><img class="align-items-center" style="max-width: 100px; max-height: 250px;" :src="'http://localhost:8000/storage/'+item.photopath"></img></td>
              <td class="align-items-center">{{ item.created_at }}</td>
              <td>
                <button class="btn btn-danger pe-3 ps-3" @click.prevent='delete_data(item.id)'>Hapus</button>
                <button class="btn btn-warning ms-2 pe-3 ps-3" data-bs-toggle="modal" data-bs-target="#editmodal" @click="saveid(item.id)">Edit</button>
              </td>
            </tr>
          </thead>
        </table>
        
        <!-- Add Modal -->
        <div class="modal fade" id="addmodal" tabindex="-1" aria-labelledby="addmodaltable">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Tambahkan Data Baru</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form action="" class="needs-validation" novalidate>
                    <label for="nisninput" class="form-label">NISN</label>
                    <input type="number" class="form-control mb-2" id="nisninput" placeholder="123456789..." v-model="nisn">
                    <label for="nameinput" class="form-label">Nama</label>
                    <input type="text" class="form-control mb-4" id="nameinput" placeholder="Davino Edric ..." v-model="name">
                    <label for="pictinput" class="form-label">Foto 3x4</label>
                    <input type="file" id="pictinput" accept="image/*" ref="photo">
                    <div class="mt-3">
                      <img id="preview" src="" alt="Preview" class="img-thumbnail d-none" style="max-width: 300px;">
                    </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click.prevent="post_data">Tambahkan data</button>
              </div>
            </div>
          </div>
        </div>
        <!-- End Add Modal -->
        
        <!-- Edit Modal -->
        <div class="modal fade" id="editmodal" tabindex="-1" aria-labelledby="editmodaltable">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Ubah data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form action="" class="needs-validation" novalidate>
                    <label for="nisninputEdit" class="form-label">NISN</label>
                    <input type="number" class="form-control mb-2" id="nisninputEdit" placeholder="123456789..." v-model="nisnEdit">
                    <label for="nameinputEdit" class="form-label">Nama</label>
                    <input type="text" class="form-control mb-4" id="nameinputEdit" placeholder="Davino Edric ..." v-model="nameEdit">
                    <label for="pictinputEdit" class="form-label">Foto 3x4</label>
                    <input type="file" id="pictinputEdit" accept="image/*" ref="photoEdit">
                    <div class="mt-3">
                      <img id="previewEdit" src="" alt="Preview" class="img-thumbnail d-none" style="max-width: 300px;">
                    </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click.prevent="update_data">Update data</button>
              </div>
            </div>
          </div>
        </div>
        <!-- End Edit Modal -->
      </div>
  </div>
</template>

<script setup lang="ts">
import { Item } from "@/types/types"; // Adjust path as needed
import axios from "axios";
import { onMounted, ref } from "vue";

const data = ref<Item[]>([]);

const get_data = async()=>{
  try {
    const response = await axios.get('http://localhost:8000/api/data')
    data.value = response.data
    console.log(data.value)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

// Add form data
const nisn = ref<number | undefined>()
const name = ref<string>('')
const photo = ref<HTMLInputElement>()

const post_data = async()=>{
  if (!nisn.value || !name.value || !photo.value?.files?.[0]) {
    console.error('Please fill all fields');
    return;
  }

  const form_data = new FormData();
  form_data.append('nisn', nisn.value.toString())
  form_data.append('name', name.value)
  form_data.append('photopath', photo.value.files[0])
  
  try {
    const packets = await axios.post('http://localhost:8000/api/store', form_data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Clear form
    nisn.value = undefined
    name.value = ''
    if (photo.value) photo.value.value = ''
    
    get_data()
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred.');
    }
  }
}

const delete_data = async(id: number)=> {
  if (!confirm('Are you sure you want to delete this data?')) {
    return;
  }
  
  try {
    const response = await axios.delete(`http://localhost:8000/api/destroy/${id}`)
    get_data()
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred.');
    }
  }
}

// Edit form data
const nisnEdit = ref<number | undefined>()
const nameEdit = ref<string>('')
const photoEdit = ref<HTMLInputElement>()
const id_edit = ref<number | null>(null)

const saveid = async(id: number)=>{
  id_edit.value = id
  
  // Load existing data for editing
  try {
    const response = await axios.get(`http://localhost:8000/api/data/${id}`)
    const studentData = response.data
    nisnEdit.value = studentData.nisn
    nameEdit.value = studentData.name
  } catch (error) {
    console.error('Error loading student data:', error)
  }
}

const update_data = async()=>{
  if (!id_edit.value || !nisnEdit.value || !nameEdit.value) {
    console.error('Please fill all required fields');
    return;
  }

  const new_data = new FormData();
  new_data.append('nisn', nisnEdit.value.toString())
  new_data.append('name', nameEdit.value)
  
  // Only append photo if a new one is selected
  if (photoEdit.value?.files?.[0]) {
    new_data.append('photopath', photoEdit.value.files[0])
  }
  
  // Laravel requires _method for PUT with FormData
  new_data.append('_method', 'PUT')

  try {
    const response = await axios.post(`http://localhost:8000/api/update/${id_edit.value}`, new_data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Clear edit form
    nisnEdit.value = undefined
    nameEdit.value = ''
    if (photoEdit.value) photoEdit.value.value = ''
    id_edit.value = null
    
    get_data()
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('An unknown error occurred.');
    }
  }
}

onMounted(()=>{
  get_data()
})
</script>