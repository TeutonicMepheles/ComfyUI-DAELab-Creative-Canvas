from comfy_api.latest import io


class TextInput(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id='DAELAB.TextInput', display_name='输入文本', category='DAELab/素材',
                         inputs=[io.String.Input('text', default='', multiline=True)],
                         outputs=[io.String.Output('text')])

    @classmethod
    def execute(cls, text=''):
        return io.NodeOutput(text)
