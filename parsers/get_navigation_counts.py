import os
import json

fail_count = 0
success_count = 0
error_counts = {}

websites_dir = "./websites"
for entry in os.scandir(websites_dir):
    website_dir = os.path.join(websites_dir, entry.name)

    with open(os.path.join(website_dir, "metadata.json")) as metadata_file:
        metadata = json.load(metadata_file)

    error_code = metadata['errorCode']
    if error_code:
        error_counts[error_code] = error_counts.get(error_code, 0) + 1
        fail_count += 1
    else:
        success_count += 1

print(f"Successful navigations: {success_count}")
print(f"Failed navigation: {fail_count}")

print("Errors:")
for code, count in sorted(error_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"{code}: {count}")
