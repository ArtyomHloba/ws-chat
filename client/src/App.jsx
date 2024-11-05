import { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FaTrash } from 'react-icons/fa';
import { getMessagesThunk } from './store/slices/messagesSlice';
import styles from './App.module.css';
import { connect } from 'react-redux';
import { createMessage, deleteMessage } from './api';

function App ({ messages, isFetching, error, limit, get }) {
  useEffect(() => {
    get(limit);
  }, [limit]);

  const addMessage = (values, formikBag) => {
    createMessage(values);
    formikBag.resetForm();
  };

  const handleDeleteMessage = id => {
    deleteMessage(id);
  };

  return (
    <article className={styles.messegerContainer}>
      <section className={styles.messageWrapper}>
        <ul className={styles.message}>
          {messages.map(m => {
            const time = new Date(m.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <li key={m._id} className={styles.messageItem}>
                <div className={styles.messageTextContainer}>
                  <p>{m.body}</p>
                  <button className={styles.trashButton}>
                    <FaTrash />
                  </button>
                </div>
                <p className={styles.messageTime}>{time}</p>
              </li>
            );
          })}
        </ul>
        <div>
          {error && <div style={{ color: 'red' }}>ERROR!!!</div>}
          {isFetching && <div>Messages is loading. Please, wait...</div>}
        </div>
      </section>

      <section className={styles.formContainer}>
        <Formik initialValues={{ body: '' }} onSubmit={addMessage}>
          <Form>
            <Field
              className={styles.input}
              placeholder='Write...'
              name='body'
            ></Field>
            <button type='submit'>Send</button>
          </Form>
        </Formik>
      </section>
    </article>
  );
}

const mapStateToProps = ({ chat }) => chat;

const mapDispatchToProps = dispatch => ({
  get: limit => dispatch(getMessagesThunk(limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
