import os

base_path = "docs"

directories = [
    d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d))
]

for directory in directories:
    dir_path = os.path.join(base_path, directory)

    for file in os.listdir(dir_path):
        if file.endswith(".html"):
            file_path = os.path.join(dir_path, file)

            with open(file_path) as f:
                content = f.read()

            content = content.replace('href="styles', 'href="../styles')
            content = content.replace('src="scripts', 'src="../scripts')

            with open(file_path, "w") as f:
                f.write(content)
