import Swal from 'sweetalert2';


const createSweetAlert = (messages, type) => {

    switch(type){

        case 'warning':
            Swal.fire({
                title: messages.title,
                text: messages.text,
                icon: messages.warning,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  });
                }
              });
            break;

        default:
            break

    }

}

export default createSweetAlert;
