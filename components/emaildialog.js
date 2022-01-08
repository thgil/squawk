import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export default function EmailDialog(props) {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const handleSubmit = async function(event) {
    event.preventDefault();

    if(!email) return closeModal();
  
    if(validateEmail(email)) {
      const res = await fetch('/api/email', {
        method: 'POST',
        mode: 'cors',
        SameSite: 'Strict',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
        })
      })

      const data = await res.json();
      if(data.err) return setEmailError(data.err);

      closeModal();
    } else {
      setEmailError('Not a valid email');
    }
  }

  function handleChange(event) {
    setEmail(event.target.value);

    setEmailError('');
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={props.class}
      >
        Get started
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-gray-900"
                >
                  We will launch soon!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mt-4 mb-2">
                    We will send a <b>single</b> email when we launch.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    You can try our demo while you wait.
                    Thank you for your interest.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <input id='email' value={email} onChange={handleChange}
                      className={
                        emailError ?
                        'appearance-none border border-red-500 rounded-tl-xl rounded-br-xl w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline' :
                        'appearance-none border focus:border-blue-500 rounded-tl-xl rounded-br-xl w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline'
                      } 
                      placeholder='name@address.com'>
                    </input>
                    <p className="block h-4 text-red-500 text-xs italic">{emailError}</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        value="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
