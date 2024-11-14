document.addEventListener('DOMContentLoaded', () => {
	const jobList = document.getElementById('jobList')
	const modal = document.getElementById('jobModal')
	const closeModal = document.querySelector('.close')
	let jobsData = []

	// Функція для завантаження даних вакансій
	async function loadJobs() {
		try {
			const response = await fetch('jobs.json')
			if (!response.ok) throw new Error('Failed to load jobs')
			const jobs = await response.json()
			jobsData = jobs
			displayJobs(jobsData)
		} catch (error) {
			jobList.innerHTML = '<p>Не вдалося завантажити дані вакансій.</p>'
		}
	}

	// Функція для форматування дати
	function formatDate(dateString) {
		const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
		return new Date(dateString).toLocaleDateString('uk-UA', options)
	}

	// Функція для відображення вакансій
	function displayJobs(jobs) {
		jobList.innerHTML = ''

		if (jobs.length === 0) {
			jobList.innerHTML = '<p>Нічого не знайдено.</p>'
			return
		}

		jobs.forEach(job => {
			const jobCard = document.createElement('div')
			jobCard.classList.add('job-card')
			jobCard.innerHTML = `
				<h3>${job.title}</h3>
				<p>Компанія: ${job.company}</p>
				<p>Локація: ${job.location}</p>
				<p>Тип: ${job.type}</p>
				<p>Досвід: ${job.experienceLevel}</p>
				<p>Дата: ${formatDate(job.postedDate)}</p>
			`
			jobCard.addEventListener('click', () => openModal(job))
			jobList.appendChild(jobCard)
		})
	}

	// Функція для фільтрації вакансій
	function filterJobs() {
		const searchQuery = document.getElementById('search').value.toLowerCase()
		const employmentType = document.getElementById('employmentType').value
		const experienceLevel = document.getElementById('experienceLevel').value
		const location = document.getElementById('location').value.toLowerCase()
		const sortCriteria = document.getElementById('sort').value

		let filteredJobs = jobsData.filter(job => {
			const matchesSearch =
				job.title.toLowerCase().includes(searchQuery) ||
				job.company.toLowerCase().includes(searchQuery)
			const matchesType = employmentType ? job.type === employmentType : true
			const matchesExperience = experienceLevel
				? job.experienceLevel === experienceLevel
				: true
			const matchesLocation = location
				? job.location.toLowerCase().includes(location)
				: true

			return (
				matchesSearch && matchesType && matchesExperience && matchesLocation
			)
		})

		// Сортування вакансій
		if (sortCriteria === 'date') {
			filteredJobs.sort(
				(a, b) => new Date(b.postedDate) - new Date(a.postedDate)
			)
		} else if (sortCriteria === 'title') {
			filteredJobs.sort((a, b) => a.title.localeCompare(b.title))
		}

		displayJobs(filteredJobs)
	}

	// Функція для відкриття модального вікна
	function openModal(job) {
		modal.style.display = 'flex'
		document.getElementById('modalTitle').innerText = job.title
		document.getElementById(
			'modalCompany'
		).innerText = `Компанія: ${job.company}`
		document.getElementById(
			'modalLocation'
		).innerText = `Локація: ${job.location}`
		document.getElementById('modalType').innerText = `Тип: ${job.type}`
		document.getElementById(
			'modalExperience'
		).innerText = `Досвід: ${job.experienceLevel}`
		document.getElementById('modalDate').innerText = `Дата: ${formatDate(
			job.postedDate
		)}`
		document.getElementById('modalDescription').innerText = job.description

		const skillsList = document.getElementById('modalSkills')
		skillsList.innerHTML = ''
		job.skills.forEach(skill => {
			const li = document.createElement('li')
			li.innerText = skill
			skillsList.appendChild(li)
		})
	}

	// Обробники подій для фільтрів
	document.getElementById('search').addEventListener('input', filterJobs)
	document
		.getElementById('employmentType')
		.addEventListener('change', filterJobs)
	document
		.getElementById('experienceLevel')
		.addEventListener('change', filterJobs)
	document.getElementById('location').addEventListener('input', filterJobs)
	document.getElementById('sort').addEventListener('change', filterJobs)

	closeModal.addEventListener('click', () => (modal.style.display = 'none'))
	window.addEventListener('click', event => {
		if (event.target === modal) modal.style.display = 'none'
	})

	// Завантаження даних вакансій
	loadJobs()
})
