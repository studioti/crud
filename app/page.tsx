'use client'

import { memo, Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, PlusCircle, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import { toast } from "sonner"

// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

const API_CARTOON = 'https://rickandmortyapi.com/api/location'

const Home = () => {
	
	const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [cartoons, setCartoons] = useState([])
	
	const [typeInput, setTypeInput] = useState("")
	const [nameInput, setNameInput] = useState("")
	const [dimensionInput, setDimensionInput] = useState("")

	{/* consulta de api */}
	const getAPI = async () => {
        try {
            
            setLoading(true)

            const response = await fetch(API_CARTOON)
            const data = await response.json()

            if(!data) throw 'Problema com a requisição'
            
            setData(data)

            const result = data.results
            const cartoons:any = Object.values(result)

            // console.log('response', response)
            // console.log('api cartoons:', cartoons)

			// criando obj localstorage cartoons
			if(!localStorage.cartoons) {
				localStorage.setItem("cartoons", JSON.stringify(cartoons))
				setCartoons(JSON.parse(localStorage.getItem("cartoons") || '""'))
				// console.log('localstorage cartoons:', JSON.parse(localStorage.getItem("cartoons") || '""'))
			} else {
				setCartoons(JSON.parse(localStorage.getItem("cartoons") || '""'))
			}

        } catch (error) {

            console.log('Erro ao consultar os dados', error)
			
			return (
				toast('Erro ao consultar os dados', {
					description: `${error}`,
				})
			)

        } finally {
            setLoading(false)
        }
    }

	{/* novo item */}
	const addItem = async () => {

		try {

			const l_cartoon = JSON.parse(localStorage.getItem('cartoons') || '""')

			const item = {
				id: Math.floor(Math.random() * 1000),
				type: typeInput,
				name: nameInput,
				dimension: dimensionInput
			}

			l_cartoon.push(item)
			localStorage.setItem("cartoons", JSON.stringify(l_cartoon))
			// console.log('item adicionado:', JSON.parse(localStorage.getItem("cartoons") || '""'))

			setTypeInput('')
			setNameInput('')
			setDimensionInput('')

			getAPI()

			return (
				toast("Registro adicionado!")
			)
			
		} catch (error) {
			
			console.log('Erro ao adicionar um novo registro', error)
			
			return (
				toast('Erro ao adicionar um novo registro', {
					description: `${error}`,
				})
			)
		}
	}

	{/* exclusao de item */}
	const deleteItem = async (id:any) => {

		try {

			const l_cartoon = JSON.parse(localStorage.getItem('cartoons') || '""')

			l_cartoon.forEach( (item:any, index:any) => {
				if(item.id === id) l_cartoon.splice(index, 1)
			})

			// console.log('registro deletado:', l_cartoon)
			localStorage.setItem("cartoons", JSON.stringify(l_cartoon))

			getAPI()

			return (
				toast("Registro deletado!")
			)
			
		} catch (error) {

			console.log('Erro ao deletar registro', error)
			
			return (
				toast('Erro ao deletar registro', {
					description: `${error}`,
				})
			)
		}
	}
	
	{/* atualização de item */}
	const updateItem = async(id:number) => {

		const l_cartoon = JSON.parse(localStorage.getItem('cartoons') || '""')

		const f_type = document.getElementById('typeEdit')
		const v_type = f_type instanceof HTMLInputElement ? f_type.value : ''

		const f_name = document.getElementById('nameEdit')
		const v_name = f_name instanceof HTMLInputElement ? f_name.value : ''
		
		const f_dimension = document.getElementById('dimensionEdit')
		const v_dimension = f_dimension instanceof HTMLInputElement ? f_dimension.value : ''

		try {

			const updatedItem = l_cartoon.map((item: { id: number }) => {
				if (item.id == id) {
					return { 
						...item, 
						type: v_type,
						name: v_name,
						dimension: v_dimension
					}
				} else {
					return item
				}
			})

			// console.log('registro atualizado:', updatedItem)
			localStorage.setItem("cartoons", JSON.stringify(updatedItem))

			getAPI()

			return (
				toast("Registro atualizado!")
			)

		} catch (error) {

			console.log('Erro ao tentar atualizar os dados', error)

			return (
				toast('Erro ao tentar atualizar os dados', {
					description: `${error}`,
				})
			)
		}
	}

	useEffect( () => {
		getAPI()
    }, [])

	return (
		<>
			<div className="p-6 max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-2">Gerenciador de Itens - Rick and Morty API</h1>
				<p>Este projeto é uma aplicação de gerenciamento de itens que consome a API pública Rick and Morty API. Com esta aplicação, é possível adicionar, excluir e editar itens.</p>
				<div className="flex py-4 items-center justify-end">
					<Dialog>
						<DialogTrigger asChild>
							<Button className="cursor-pointer">
								<PlusCircle /> Novo item
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Novo registro</DialogTitle>
								<DialogDescription>Para adicionar, informe todos os dados abaixo.</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								{/* tipo */}
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="type" className="text-right">Tipo</Label>
									<Input onChange = {(event)=> setTypeInput(event.target.value)} id="type" defaultValue='' className="col-span-3" />
								</div>

								{/* nome */}
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="name" className="text-right">Nome</Label>
									<Input onChange = {(event)=> setNameInput(event.target.value)} id="name" defaultValue='' className="col-span-3" />
								</div>
								
								{/* dimensao */}
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="dimension" className="text-right">Dimensão</Label>
									<Input onChange = {(event)=> setDimensionInput(event.target.value)} id="dimension" defaultValue='' className="col-span-3" />
								</div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									{ 
										nameInput == '' || typeInput == '' || dimensionInput == ''
									? 	<Button disabled>Adicionar</Button>
									:	<Button onClick={ () => addItem() } className="cursor-pointer">Adicionar</Button>
									}
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="border rounded p-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>#ID</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Nome</TableHead>
								<TableHead>Dimensão</TableHead>
								<TableHead className="flex items-center justify-center">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Suspense fallback={<div>Carregando ...</div>}>
								{
									loading && !data &&
									<span>Carregando...</span>
								}
								{
									cartoons.map( (item, index) => {
										return (
											<TableRow key={index}>
												<TableCell>{ item['id'] }</TableCell>
												<TableCell>{ item['type'] }</TableCell>
												<TableCell>{ item['name'] }</TableCell>
												<TableCell>{ item['dimension'] }</TableCell>
												<TableCell className="flex items-center justify-center">

													{/* editar registro */}
													<Dialog>
														<DialogTrigger asChild>
															<Button variant={"link"} className="cursor-pointer"><Edit /></Button>
														</DialogTrigger>
														<DialogContent className="sm:max-w-[425px]">
															<DialogHeader>
																<DialogTitle>Atualizar registro <b>#{ item['id'] }</b></DialogTitle>
																<DialogDescription>Realize as alterações do registro selecionado.</DialogDescription>
															</DialogHeader>
															<div className="grid gap-4 py-4">
																{/* id# */}
																<div className="grid grid-cols-4 items-center gap-4">
																	<Label htmlFor="idEdit" className="text-right">#</Label>
																	<Input disabled id="idEdit" defaultValue={ item['id'] } className="col-span-3" />
																</div>
							
																{/* tipo */}
																<div className="grid grid-cols-4 items-center gap-4">
																	<Label htmlFor="typeEdit" className="text-right">Tipo</Label>
																	<Input id="typeEdit" defaultValue={ item['type'] } className="col-span-3" />
																</div>
							
																{/* nome */}
																<div className="grid grid-cols-4 items-center gap-4">
																	<Label htmlFor="nameEdit" className="text-right">Nome</Label>
																	<Input onChange = {(event)=> setNameInput(event.target.value)} id="nameEdit" defaultValue={ item['name'] } className="col-span-3" />
																</div>
																
																{/* dimensao */}
																<div className="grid grid-cols-4 items-center gap-4">
																	<Label htmlFor="dimensionEdit" className="text-right">Dimensão</Label>
																	<Input onChange = {(event)=> setDimensionInput(event.target.value)} id="dimensionEdit" defaultValue={ item['dimension'] } className="col-span-3" />
																</div>
															</div>
															<DialogFooter>
																<DialogClose asChild>
																	<Button onClick={ () => updateItem( item['id'] ) } className="cursor-pointer">Editar</Button>
																</DialogClose>
															</DialogFooter>
														</DialogContent>
													</Dialog>

													{/* excluir registro */}
													<Dialog>
														<DialogTrigger asChild>
															<Button variant={"link"} className="cursor-pointer text-red-700"><Trash2 /></Button>
														</DialogTrigger>
														<DialogContent className="sm:max-w-[425px]">
															<DialogHeader>
																<DialogTitle>Excluir registro <b>#{ item['id'] }</b></DialogTitle>
																<DialogDescription>Os dados do registro serão excluídos permanentemente.</DialogDescription>
															</DialogHeader>
															<div>
																<DialogDescription>ID: { item['id'] }</DialogDescription>
																<DialogDescription>Tipo: { item['type'] }</DialogDescription>
																<DialogDescription>Nome: { item['name'] }</DialogDescription>
																<DialogDescription>Dimensão: { item['dimension'] }</DialogDescription>
															</div>
															<DialogFooter>
																<DialogClose asChild>
																	<Button onClick={ () => deleteItem( item['id']) } variant={"destructive"} className="cursor-pointer">Excluir</Button>
																</DialogClose>
															</DialogFooter>
														</DialogContent>
													</Dialog>
												</TableCell>
											</TableRow>
										)
									})
								}
							</Suspense>
						</TableBody>
					</Table>
				</div>
			</div>
		</>
	)
}

export default memo(Home)
