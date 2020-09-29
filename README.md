# xcode-select

This GitHub Action is a wrapper around `xcode-select` and will let you easily pick a specific Xcode version to be used in your workflow.

## Usage

The most basic usage will be without any inputs, which will default to `version: "latest"`

```yml
steps:
  - uses: ./.github/actions/xcode-select
```

If you want to pin a specific version, specify it with the `version` input.

```yml
steps:
  - uses: ./.github/actions/xcode-select
    with:
      version: "12.0.0"
```

Although Apple does not use semantic versioning for Xcode, the GitHub virtual environments for macOS do, so you can use version numbers like `10.3.1` or `12.0.0`.

## License

This action is released under the [MIT License](LICENSE).

## Contributions

Contributions are welcome. One of the most impactful things you can do is to file issues.

