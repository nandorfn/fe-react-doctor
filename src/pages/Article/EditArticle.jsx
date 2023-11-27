import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import client from "../../utils/auth"
import useForm from "../../hooks/useForm"
import { Editor } from "../../components/Editor"
import { Input } from "../../components/ui/Form"
import { Button } from "../../components/ui/Button"
import { ErrorMsg } from "../../components/Error/ErrorMsg"
import './Article.css'
import { useGetQuery } from "../../hooks/useGetQuery"
import { validateArticleForm, validateExtImage } from "../../utils/validation"
const initialError = {
  title: '',
  image: '',
  content: '',
}
export const EditArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idArticle = searchParams.get('id');
  const {
    data,
    isPending,
    isError,
    refetch
  } = useGetQuery('articleEdit', `/doctors/articles/${idArticle}`);
  const initialState = {
    title: data?.results?.title,
    image: data?.results?.image,
    tempImage: data?.results?.image,
  }
  
  const {
    form,
    setForm,
    error,
    setError,
    handleInput,
  } = useForm(initialState, initialError);
  const [content, setContent] = useState(data?.results?.content);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateExtImage(file)) {
        setError({
          ...error,
          image: 'Hanya file dengan ekstensi .jpg, .jpeg, dan .png yang diperbolehkan.'
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataURL = e.target.result;
          setForm({
            ...form,
            image: file,
            tempImage: dataURL,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePost = async () => {
    const data = new FormData();
    data.append('title', form.title);
    data.append('content', content);
    data.append('image', form.image);
    if (validateArticleForm(form, content, setError)) {
      try {
        const res = await client.put(`/doctors/articles/${idArticle}`, data);
        if (res.status === 201 || res.status === 200) {
          navigate('/articles')
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <div className="px-4 d-flex flex-column gap-4 mt-3">

        <div>
          <div className="d-flex flex-row justify-content-between gap-3">
            <Input
              placeHolder={'Judul'}
              name={'title'}
              type={'text'}
              maxLength={50}
              style={{ maxWidth: '90%' }}
              className={'border-start-0 border-top-0 border-end-0'}
              handleChange={(e) => handleInput(e)}
              value={form.title}
            />
            <Button onClick={handlePost} className={'btn-primary text-white'}>
              Posting
            </Button>
          </div>
          {error.title && <ErrorMsg msg={error.title} />}
        </div>

        <div className="mx-auto">
          {form.tempImage === null
            ?
            <>
              <div className="text-center">
                <input
                  onChange={(e) => handleFileInputChange(e)}
                  type="file"
                  id="file"
                  className={`inputfile form-control`}
                  name="file"
                />
                <label htmlFor="file">Upload Foto</label>
              </div>
              {error.image && <ErrorMsg msg={error.image} />}
            </>
            : <img src={form.tempImage} width={211} alt="temp image" />
          }
        </div>

        <div className="mb-5">
          {error.content && <ErrorMsg msg={error.content} />}
          <Editor content={content} setContent={setContent} />
        </div>
      </div>
    </>
  )
}