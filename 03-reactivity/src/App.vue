<script setup>
import { nextTick, ref, reactive } from 'vue'

const count = ref(0)

//nextTick là một hàm trong Vue.js cho phép bạn đợi cho đến khi DOM được cập nhật sau khi thay đổi dữ liệu. Khi bạn gọi nextTick, Vue sẽ đợi cho đến khi tất cả các thay đổi dữ liệu đã được áp dụng và DOM đã được cập nhật trước khi thực hiện bất kỳ hành động nào tiếp theo. Điều này rất hữu ích khi bạn muốn đảm bảo rằng giao diện người dùng đã phản ánh đúng các thay đổi dữ liệu trước khi thực hiện các thao tác khác, như truy cập vào phần tử DOM hoặc thực hiện các tính toán dựa trên trạng thái mới của dữ liệu.
const increase = async () => {
  count.value++
  console.log(document.getElementById('count').innerText)
  await nextTick()
  console.log(document.getElementById('count').innerText)
}

// ref theo dõi sâu các thuộc tính của đối tượng
// Nếu bạn muốn theo dõi một đối tượng phức tạp, bạn có thể sử dụng ref để tạo một đối tượng phản ứng. Khi bạn thay đổi thuộc tính của đối tượng, Vue sẽ tự động cập nhật giao diện người dùng.
const user = ref({
  name: 'John',
  age: 30,
})

const updateUser = () => {
  user.value.name = 'Jane' + Math.floor(Math.random() * 100) //random
  user.value.age = Math.floor(Math.random() * 100) //random
}

// nên dùng reactive để theo dõi một đối tượng phức tạp, vì nó sẽ tự động theo dõi tất cả các thuộc tính của đối tượng mà không cần phải sử dụng .value. Tuy nhiên, nếu bạn chỉ cần theo dõi một giá trị đơn giản hoặc một đối tượng nhỏ, ref có thể là lựa chọn tốt hơn vì nó đơn giản hơn và dễ sử dụng hơn.
const user2 = reactive({
  name: 'John',
  age: 30,
})

const updateUser2 = () => {
  user2.name = 'Jane' + Math.floor(Math.random() * 100) //randow
  user2.age = Math.floor(Math.random() * 100) //random
}
</script>

<template>
  <div>
    <p id="count">Count: {{ count }}</p>
    <button @click="increase">Increase</button>

    <p>User: {{ user.name }}, Age: {{ user.age }}</p>
    <button @click="updateUser">Update User</button>
  </div>
</template>
