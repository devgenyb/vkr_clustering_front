import logo from './logo.svg';
import './App.css';
import "primereact/resources/themes/luna-pink/theme.css";
import "primereact/resources/primereact.min.css";

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';


const host = 'http://localhost:5000'


function App() {

  const [method, setMethod] = useState('')
  const [file, setFile] = useState(false)
  const [vectorMethod, setVectorMethod] = useState(null)
  const [maxclusters, setMaxclusters] = useState(15)
  const [imageClusters, setImageClusters] = useState(null)
  const [imagedend, setImagedend] = useState(null)
  const [imageelbow, setImageelbow] = useState(null)
  const [imagesil, setImageesil] = useState(null)
  const [softStep, setSoftStep] = useState(0)
  const [predNClusters, setPredNClusters] = useState(null)
  const [algMethod, setAlgMethod] = useState(null)
  const [nclasters, setNclasters] = useState(0)
  const [dbscaneps, setDbscaneps] = useState('0')
  const [resultFile, setResultFile] = useState(null)
  const [clusterImage, setClusterImage] = useState(null)



  const onUpload = (e) => {
    console.log(e);
  }

  const fileHanlder = (e) => {
    setFile(e.target.files[0])
  }


  const firstStepHandler = (e) => {
    if(!method || !file) return
    if (method === 'soft') {
      setSoftStep(1)
    }
  }

  const semantocCoreVizualiver = async (e) => {
      if (!method || !file || !vectorMethod) return
      const formData = new FormData()


      const data = {
        method,
        vectorMethod,
        maxclusters

      }

      formData.append('data', JSON.stringify(data))
      formData.append('file', file)

      try {
        const response = await axios.post('http://127.0.0.1:5000/visualizer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response);
      setImagedend(response.data['dendogram'])
      setImageelbow(response.data['elbow'])
      setImageesil(response.data['silluete'])
      setImageClusters(response.data['clusters_forms'])
      setPredNClusters(response.data['n_clusters'])
      setSoftStep(2)
      } catch (error) {
        console.log(error);
      }
  }

  const clustering = async () => {
    if (!method || !file || !vectorMethod) return

    const formData = new FormData()

    console.log(dbscaneps);

    const data = {
      method,
      vectorMethod,
      algMethod,
      nclasters,
      dbscaneps:  parseFloat(dbscaneps),
    }

    console.log(data);

    formData.append('data', JSON.stringify(data))
    formData.append('file', file)

    try {
      const response = await axios.post('http://127.0.0.1:5000/clustering', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response);
    setSoftStep(3)
    setClusterImage(response.data['diagram'])
    setResultFile(response.data['file'])
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="App">
      <header>
        <p>
        Кластеризация семантического ядра
        </p>
      </header>
      <main>
        <div className='container'>
            <div className='clustering_method'>
              <p className='text2'>
                Метод кластеризации
              </p>
              <div className="flex flex-wrap gap-3 mr">
                <div className="flex align-items-center">
                    <RadioButton inputId="method1" name="method" value="soft" onChange={(e) => setMethod(e.value)} checked={method === 'soft'} />
                    <label htmlFor="method1" className="ml-2">soft</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="method2" name="method" value="middle" onChange={(e) => setMethod(e.value)} checked={method === 'middle'} />
                    <label htmlFor="method2" className="ml-2">middle</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="method2" name="method" value="hard" onChange={(e) => setMethod(e.value)} checked={method === 'hard'} />
                    <label htmlFor="method2" className="ml-2">hard</label>
                </div>
            </div>
            </div>
            <div className='file-container'>
              <div className='file-input'>
              <input
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
                accept=".xls,.xlsx"
                onChange={fileHanlder}
              />   
              </div> 
            </div>
          
            <div className='flex align-items-center justify-center m-10'>
              <Button label="Продолжить" onClick={firstStepHandler} disabled={!method || !file} />
            </div>
            <div className="card flex justify-center">
            {softStep > 0 &&
            <div className='flex flex-col align-items-center justify-center'>
              <div className='m-5 text2'>Выберите метод векторизации</div>
              <Dropdown value={vectorMethod} onChange={(e) => {setVectorMethod(e.value); console.log(e.value);}} options={[
                {name: 'DF-IDF', code: 'df-idf'}, {name: 'SBERT', code: 'sbert'}
              ]} optionLabel="name" 
                  placeholder="Метод векторизации" className="w-full md:w-14rem" />
              <p className='text2 m-4'>Максимум кластеров</p>
              <InputText value={maxclusters} onChange={(e) => setMaxclusters(e.target.value)} />
              <Slider value={maxclusters} onChange={(e) => {setMaxclusters(e.value); console.log(e.value);}} />
            </div>
            }
            
        </div>
        {
          softStep > 0 &&
          <div className='flex justify-center m-5'>
            <Button label="Загрузить" onClick={semantocCoreVizualiver} disabled={!method || !file || !vectorMethod || maxclusters < 5} />
          </div>
        }

        {
          softStep > 1 &&
          <div className='graphics'>
            <img src={host + imageClusters} />
            <img src={host + imagedend} />
            <img src={host + imageelbow} />
            <img src={host + imagesil} />
            <p className='text2'>
              Предлогаемое число кластеров для k-means {predNClusters.map((item, i) => `${item}${i+1 !== predNClusters.length ? ', ' : ' '}`)}
            </p>
          </div>
          
        }


        {
          softStep > 1 &&
          <div>
          <div className='choose-alg m-20 flex justify-center'>
            <div className='w-60'>
            <label htmlFor="ncluster" className="font-bold block mb-2">Алгоритм</label>
            <Dropdown value={algMethod} onChange={(e) =>{ setAlgMethod(e.value); console.log(e.value)}} options={[
                {name: 'K-MEANS++', code: 'kmeans'}, {name: 'DBSCAN', code: 'dbscan'}, {name: 'Агломеративный', code: 'Aglomirative'}
              ]} optionLabel="name" 
                  placeholder="Метод векторизации" className="w-full md:w-14rem" />
                  </div>
                {algMethod && algMethod.code === 'kmeans' &&
                <div className='w-30'>
                  <label htmlFor="ncluster" className="font-bold block mb-2">Кол-во кластеров</label>
                  <InputNumber inputId="ncluster" value={nclasters} onValueChange={(e) => setNclasters(e.value)} />
                </div>
              }
              {algMethod && algMethod.code === 'dbscan' &&
                <div className='w-30'>
                  <label htmlFor="eps" className="font-bold block mb-2">Eps</label>
                  <InputText value={dbscaneps} onChange={(e) => {setDbscaneps(e.target.value); console.log(e.target.value);}} />
                </div>
              }
              {algMethod && algMethod.code === 'Aglomirative' &&
                <div className='w-30'>
                  <label htmlFor="ncluster" className="font-bold block mb-2">Кол-во кластеров</label>
                  <InputNumber inputId="ncluster" value={nclasters} onValueChange={(e) => setNclasters(e.value)} />
                </div>
              }
          </div>
            <div className='flex justify-center m-5'>
              {/* <Button label="Кластеризовать" onClick={clustering} disabled={!method || !file || !vectorMethod || !algMethod || (nclasters < 3)} /> */}
              <Button label="Кластеризовать" onClick={clustering} />
            </div>
          </div>
        }

        {
          softStep > 2 &&
          <div>
          <div className='flex justify-center'>
          <img src={host + clusterImage} />
          
          </div>
          <div className='flex justify-center m-5'>
              <Button label='Скачать результат' />
          </div>
          </div>
        }
        
        </div>
      </main>
    </div>
  );
}

export default App;
