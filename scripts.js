const supabaseClient = supabase.createClient('https://noaltlxgzdfwytveozbz.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWx0bHhnemRmd3l0dmVvemJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMTQ5NTcsImV4cCI6MjAzODY5MDk1N30.9vAFvUtuGHRswvO_298Wg9_YMPmHLAu-N_89dj3KJTM')

// insert task into the table

async function insert(task){
  const {error} = await supabaseClient.from('todos').insert({task: task})
}

document.getElementById('form').addEventListener('submit',(e)=>{
  e.preventDefault()
  const task = document.getElementById("task").value
  insert(task)
  e.target.reset()
})

const handleInserts = (payload)=>{
  console.log("change received",payload)
}

supabaseClient.channel('public:todos').on('postgres_changes',{event: '*',schema: 'public',table: 'todos'},handleInserts).subscribe()

// broadcast message

const channelA = supabaseClient.channel('room-1')

const messageReceived = (payload)=>{
  console.log(payload.payload.message)
}

channelA.on('broadcast',{event:'test'},messageReceived).subscribe()

supabaseClient.channel('public:todos').on('postgres_changes',{event: '*',schema: 'public',table: 'todos'},handleInserts).subscribe()

const channelB = supabaseClient.channel('room-1')

document.getElementById('sendmessage').addEventListener("click",()=>{
  channelB.send({type:'broadcast',event:'test',payload:{message:"hello world"}})
})